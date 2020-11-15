var common = require('./common');

module.exports = {
    LCD: 0,
    SWITCH0: 0,
    SWITCH1: 0,
    FAN: 0,
    LED_RGBIO: 0,
    LED_RED: 0,
    LED_GREEN: 0,
    HEAT: 0,
    SPEED: 0,
    SPACE0: 0,
    SLIDER0: 0, 
    SLIDER1: 0,
    SLIDER2: 0,
    SPACE1: 0,
    LED_RGB: [0,0,0],
    SPACE2: 0,
    PICK_COLOR: [0,0,0],
    MESSAGE: 0,

    converToBits: function() {

    },

    convertToFlags: function(bits) {

        var f8b = parseInt(bits.slice(0,2), 16).toString(2)
        f8b = common.zeroPadding(f8b, 8);

        // ON - OFF flags
        this.LCD = parseInt(f8b[0]);
        this.SWITCH0 = parseInt(f8b[1]);
        this.SWITCH1 = parseInt(f8b[2]);
        this.FAN = parseInt(f8b[3]);
        this.LED_RGBIO = parseInt(f8b[4]);
        this.LED_RED = parseInt(f8b[5]);
        this.LED_GREEN = parseInt(f8b[6]);
        this.HEAT = parseInt(f8b[7]);

        // SPEED 
        this.SPEED = parseInt(bits.slice(2,3), 16);

        // SPACE0 
        this.SPACE0 = parseInt(bits.slice(3,4), 16);

        // SLIDER0
        this.SLIDER0 = parseInt(bits.slice(4,6), 16);

        // SLIDER1
        this.SLIDER1 = parseInt(bits.slice(6,8), 16);

        // SLIDER2
        this.SLIDER2 = parseInt(bits.slice(8,10), 16);

        // SPACE1
        this.SPACE1 = parseInt(bits.slice(10,11), 16);

        // LED RGB
        this.LED_RGB = [
            parseInt(bits.slice(11,13), 16),
            parseInt(bits.slice(13,15), 16),
            parseInt(bits.slice(15,17), 16),
        ];

        // SPACE2 
        this.SPACE2 = parseInt(bits.slice(17,18), 16);

        // PICK COLOR
        this.PICK_COLOR = [
            parseInt(bits.slice(18,20), 16),
            parseInt(bits.slice(20,22), 16),
            parseInt(bits.slice(22,24), 16),
        ];

        // MESSAGE 
        this.MESSAGE = bits.slice(24, bits.length);
        if(this.MESSAGE.length > 32) this.MESSAGE = this.MESSAGE.slice(0, 32);
        this.MESSAGE = common.hex2a(this.MESSAGE)
    },

    convertToHex: function() {

        let fullMsg = "";

        // ON - OFF Flags
        fullMsg += this.LCD === 0 ? "0" : "1"
        fullMsg += this.SWITCH0 === 0 ? "0" : "1"
        fullMsg += this.SWITCH1 === 0 ? "0" : "1"
        fullMsg += this.FAN === 0 ? "0" : "1"
        fullMsg += this.LED_RGBIO === 0 ? "0" : "1"
        fullMsg += this.LED_RED === 0 ? "0" : "1"
        fullMsg += this.LED_GREEN === 0 ? "0" : "1"
        fullMsg += this.HEAT === 0 ? "0" : "1"

        fullMsg = common.zeroPadding(parseInt(fullMsg, 2).toString(16), 2)

        // SPEED
        fullMsg += this.SPEED.toString(16)

        // SPACE0
        fullMsg += this.SPACE0.toString(16)

        // SLIDER0
        fullMsg += common.zeroPadding(this.SLIDER0.toString(16), 2)

        // SLIDER1
        fullMsg += common.zeroPadding(this.SLIDER1.toString(16), 2)

        // SLIDER2
        fullMsg += common.zeroPadding(this.SLIDER2.toString(16), 2)

        // SPACE1
        fullMsg += this.SPACE1.toString(16)

        // LED RGB
        fullMsg += common.zeroPadding(this.LED_RGB[0].toString(16), 2)
        fullMsg += common.zeroPadding(this.LED_RGB[1].toString(16), 2)
        fullMsg += common.zeroPadding(this.LED_RGB[2].toString(16), 2)

        // SPACE2 
        fullMsg += this.SPACE2.toString(16)

        // PICK COLOR
        fullMsg += common.zeroPadding(this.PICK_COLOR[0].toString(16), 2)
        fullMsg += common.zeroPadding(this.PICK_COLOR[1].toString(16), 2)
        fullMsg += common.zeroPadding(this.PICK_COLOR[2].toString(16), 2)

        // MESSAGE
        fullMsg += common.zeroPadding(common.a2hex(this.MESSAGE))

        return fullMsg
    },

    deviceToNL: (id, obj) => {
        if(id === "id01" || id === "id02") {
            let text = obj.status > 180 ? "templado" : 
                       obj.status > 90 ? "frio" :
                       "helado";
            return {
                sensor: obj.status,
                status: obj.status == 0 ? false : true,
                text: text
            }
        }

        if(id === "id03" || id === "id04") {
            return {
                sensor: obj.status,
                status: obj.status == 0 ? false : true,
                text: obj.status == 0 ? "apagado" : "encendido"
            }
        }

        if(id === "id05") {
            let text = obj.status === "255,233,0" ? "precaucion" :
                       obj.status === "255,0,0" ? "alerta" :
                       obj.status === "0,255,0" ? "correcto" : "correcto";
            return {
                sensor: obj.status,
                status: obj.status == 0 ? false : true,
                text: text
            }
        }

        if(id === "id06" || id === "id07") {
            return {
                sensor: obj.status,
                status: obj.status == 0 ? false : true,
                text: obj.status == 0 ? "encendido" : "apagado"
            }
        }
        
    },

    NLToDevice: (id, text) => {
        if(id === "id01" || id === "id02") {
            
            if(isNaN(text)) {
                return text === "templado" ? 180 :
                       text === "frio" ? 90 :
                       0;

            } else {
                return parseInt(text);
            }
        }

        if(id === "id03" || id === "id04") {
            return text === "encendido" ? 1 : 0;
        }

        if(id === "id05") {
            return text === "precaucion" ? [255,233,0] :
                   text === "alerta" ? [255,0,0] :
                   [0,255,0];
        }   

        if(id === "id06" || id === "id07") {
            return text === "encendido" ? 1 : 0;;
        }
    },

    getTypeById: (id) => {
        if(id === "id01" || id === "id02" || id === "id03") return "input";
        if(id === "id04" || id === "id05" || id === "id06" || id === "id07") return "output";
        return "na";
    },

    getValueNumberById: function(id) {
        if(id === "id01") return this.SLIDER0;
        if(id === "id02") return this.SLIDER1;
        if(id === "id03") return this.SWITCH0;
        if(id === "id04") return this.SWITCH1;
        if(id === "id05") return this.LED_RGB;
        if(id === "id06") return this.LED_RED;
        if(id === "id07") return this.HEAT;
        return null;
    },

    getValueTextById: function(id) {
        if(id === "id01") {
            return this.SLIDER0 > 180 ? "templado" : 
                        this.SLIDER0 > 90 ? "frio" :
                       "helado";
        }

        if(id === "id02") {
            return this.SLIDER1 > 180 ? "templado" : 
                        this.SLIDER1 > 90 ? "frio" :
                       "helado";
        }

        if(id === "id03") return this.SWITCH0 == 0 ? "apagado" : "encendido";
        if(id === "id04") return this.SWITCH1 == 0 ? "apagado" : "encendido";

        if(id === "id05") {
            return this.LED_RGB.toString() === "255,233,0" ? "precaucion" :
                    this.LED_RGB.toString() === "255,0,0" ? "alerta" :
                    this.LED_RGB.toString() === "0,255,0" ? "correcto" : "correcto";
        }

        if(id === "id06") return this.LED_RED == 0 ? "encendido" : "apagado";
        if(id === "id07") return this.HEAT == 0 ? "encendido" : "apagado";
    }
}