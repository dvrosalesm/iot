var interactionModel = require('./models/interaction_model')
var hardwareModel = require('./models/hardware_model')

module.exports = {

    logInteraction: function(req, res, body) {
        let interactionObj = {
            request: {
                headers: req.headers,
                body: {
                    data: JSON.stringify(req.body)
                }
            },
            response: {
                headers: res.getHeaders(),
                body: {
                    data: JSON.stringify(body)
                }
            }
        }
        interactionModel.create(interactionObj);
    },

    logInfo: function(infoObj) {
        const hObj = new hardwareModel({
            devices: [
                {
                    id: "id01",
                    tag: "Temperatura congelador 1",
                    type: "input",
                    status: infoObj.SLIDER0.toString()
                },
                {
                    id: "id02",
                    tag: "Temperatura congelador 2",
                    type: "input",
                    status: infoObj.SLIDER1.toString()
                },
                {
                    id: "id03",
                    tag: "Activar prevencion de frio",
                    type: "input",
                    status: infoObj.SWITCH0.toString()
                },
                {
                    id: "id04",
                    tag: "Encender sistema frio",
                    type: "output",
                    status: infoObj.SWITCH1.toString()
                },
                {
                    id: "id05",
                    tag: "Estado del sistema",
                    type: "output",
                    status: infoObj.LED_RGB.toString()
                },
                {
                    id: "id06",
                    tag: "Se necesita mantenimiento",
                    type: "output",
                    status: infoObj.LED_RED.toString()
                },
                {
                    id: "id07",
                    tag: "Calefaccion",
                    type: "output",
                    status: infoObj.HEAT.toString()
                }
            ]
        });
        hObj.save();
        
    }

} 