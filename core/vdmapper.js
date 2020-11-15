var common = require('./common');

module.exports = {
    LCD: 0,
    SWITCH0: 0,
    SWITCH1: 0,
    FAN: 0,
    LED_RGB: 0,
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
        this.LED_RGB = parseInt(f8b[4]);
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

        if(this.MESSAGE.length > 32) {
            this.MESSAGE = this.MESSAGE.slice(0, 32);
        }
    }
}