var express = require('express');
const common = require('../core/common');
var router = express.Router();
var vd = require('../core/vdmapper');
var storage = require('../core/storage')
var logger = require('../core/logger');
const e = require('express');
var IOMiddleware = require('../core/io_middleware');

router.post('/', IOMiddleware, (req, res) => {

    if( !(req.body.change) ) {
        common.errorResponse(res, "Inputs faltantes");
        logger.logInteraction(req, res, res.body);
        res.json(res.body);
    } else {
        let keys = Object.keys(req.body.change);
        vd.convertToFlags(storage.get("vd"))
        keys.map( i => {
            let deviceStatus = vd.NLToDevice(i, req.body.change[i].text)
            if(i === "id04") {
                vd.SWITCH1 = deviceStatus;
            } else if(i === "id05") {
                if(req.body.change[i].status) {
                    vd.LED_RGBIO = 1;
                } else {
                    vd.LED_RGBIO = 0;
                }
                vd.LED_RGB = deviceStatus;
            } else if(i === "id06") {
                vd.LED_RED = deviceStatus;
            } else if(i === "id07") {
                vd.HEAT = deviceStatus;
            } 
        });
        storage.set("vd", vd.convertToHex())

        logger.logInteraction(req, res, res.body)
        res.json(res.body)
    }
})

module.exports = router;