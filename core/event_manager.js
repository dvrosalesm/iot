var eventModel = require('../core/models/event_model');
var executedModel = require('../core/models/executed_model');
var vd = require('../core/vdmapper');
var storage = require('../core/storage')
var common = require('../core/common');
var axios = require('axios').default;

const localURL = "https://iot-9b4eg.ondigitalocean.app";

class IOEvent {

    constructor(event) {
        this.event = event;

        // Only used for external events
        this.isRunning = false;
        this.interval = null;

        this.runInternally = this.runInternally.bind(this)
        this.runExternally = this.runExternally.bind(this)
        this.initExternally = this.initExternally.bind(this)
        this.stopExternally = this.stopExternally.bind(this)
        this.executeElse = this.executeElse.bind(this)
        this.readjustInterval = this.readjustInterval.bind(this)
    }

    runInternally() {
        vd.convertToFlags(storage.get("vd"))
        
        // Execute if
        let sensor = this.event.if.left.id;
        let rightIf = this.event.if.right.text || this.event.if.right.sensor || this.event.if.right.status;
        let leftIf = isNaN(rightIf) ? vd.getValueTextById(sensor) : vd.getValueNumberById(sensor);
        let condition = this.event.if.condition;
        let result = common.doOperation(leftIf, rightIf, condition);;

        // Execute then - else
        if(result) {
            this.executeChange(this.event.then, this.event.idEvent, true);
        } else {
            if(this.event.else && this.event.else != null)
                this.executeChange(this.event.else, this.event.idEvent, false);
        }
    }

    initExternally() {
        if(this.interval === null) this.interval = setInterval(this.runExternally, this.event.if.left.freq);
    }

    stopExternally() {
        clearInterval(this.interval);
        this.interval = "DONE";
    }

    runExternally() {
        let self = this;
        let url = this.event.if.left.url;
        let data = {
            id: "CongeladorIoT_DR17002913",
            url: "https://iot-9b4eg.ondigitalocean.app",
            date: common.getCurrentDate(),
            search: {
                "id_hardware": this.event.if.left.id,
                finish_date: common.getCurrentDate(),
                start_date: common.getCurrentDateSubMin(2)
            }
        }
        axios.post(url + "/search", data).then( (res) => {
            let result = res.data;
            if(result.status === "OK") {
                let resultsData = result.data;
                let objKeys = Object.keys(resultsData);
                let resultOperation = false;
                objKeys.forEach( i => {
                    let leftIf = i.sensor || i.status || i.text;
                    let rightIf = self.event.if.right.sensor;
                    let condition = self.event.if.condition;
                    if(!resultOperation) {
                        resultOperation = common.doOperation(i.sensor, rightIf, condition);
                    }
                })
                if(resultOperation) self.executeChange(self.event.then, self.event.idEvent, true);
                else self.executeElse();
            }
        })
        .catch( (err) => {
            console.log("error");
            console.log(err)
        })
    }

    executeElse() {
        if(this.event.else && this.event.else != null) this.executeChange(this.event.else, this.event.idEvent, false);
    }

    executeChange(eventChange, eventId, endedIn) {
        if(eventChange.url.includes(localURL)) {
            vd.convertToFlags(storage.get("vd"));
            let device = eventChange.id;
            let deviceStatus = vd.NLToDevice(device, eventChange.text);
            if(device === "id04") {
                vd.SWITCH1 = deviceStatus;
            } else if(device === "id05") {
                if(req.body.change[i].status) {
                    vd.LED_RGBIO = 1;
                } else {
                    vd.LED_RGBIO = 0;
                }
                vd.LED_RGB = deviceStatus;
            } else if(device === "id06") {
                vd.LED_RED = deviceStatus;
            } else if(device === "id07") {
                vd.HEAT = deviceStatus;
            } 
            storage.set("vd", vd.convertToHex());
            console.log("Executed event: " + eventId);
            executedModel.create({
                idEvent: eventId,
                result: endedIn,
                changed: eventChange
            });
        } else {
            let changeData = {
                id: "CongeladorIoT_DR17002913",
                url: "https://iot-9b4eg.ondigitalocean.app",
                date: common.getCurrentDate(),
                change: {},
                perro: "gato"
            }
            changeData.change[eventChange.id] = {};

            if(eventChange.status) changeData.change[eventChange.id].status = eventChange.status;
            if(eventChange.sensor) changeData.change[eventChange.id].sensor = eventChange.sensor;
            if(eventChange.text) changeData.change[eventChange.id].text = eventChange.text;

            axios.post(eventChange.url + "/change", changeData).then( (res) => {
                console.log("Executed event: " + eventId);
                executedModel.create({
                    idEvent: eventId,
                    result: endedIn,
                    changed: eventChange
                });
            }).catch( (err) => {
                executedModel.create({
                    idEvent: eventId,
                    result: endedIn,
                    changed: eventChange,
                    onError: err
                });
            })
        }
    }

    readjustInterval() {
        clearInterval(this.interval);
        this.interval = setInterval(this.runExternally, this.event.if.left.freq);
    }

}

module.exports = {
    internalEvents: [],
    externalEvents: [],

    checkForEvents: function() {
        let self = this;
        eventModel.find({}).exec((err, data) => {
            self.internalEvents = [];
            data.forEach( i => {
                if(i.if.left.url.includes(localURL)) {
                    self.internalEvents.push({
                        id: i.idEvent,
                        event: new IOEvent(i)
                    })
                } else {
                    let foundExternal = self.externalEvents.filter( el => el.id === i.idEvent)
                    if(foundExternal.length === 0) {
                        self.externalEvents.push({
                            id: i.idEvent,
                            event: new IOEvent(i)
                        })
                    } else {
                        foundExternal[0].event.event = i
                    }
                }
            })

            // clear external deleted  
            let newExternalEvents = []; 
            self.externalEvents.forEach((el) => {
                if(data.find( k => k.idEvent === el.id)) {
                    newExternalEvents.push(el);
                } else {
                    el.event.stopExternally();
                }
            })
            self.externalEvents = newExternalEvents;
            self.internalEvents.forEach( i => i.event.runInternally());
            self.externalEvents.forEach( i => i.event.initExternally());

        });
    }
}