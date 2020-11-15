var express = require('express');
var logger = require('../core/logger');
var IOMiddleware = require('../core/io_middleware');
var hardwareModel = require('../core/models/hardware_model');
var router = express.Router();

router.get('/', IOMiddleware, (req, res) => {
    logger.logInteraction(req, res, res.body);

    hardwareModel.findOne().sort({ date: -1 }).limit(1).exec((err, data) => {
        if(!err) {
            if(data.devices) {
                let devicesResult = {};
                data.devices.map((i) => {
                    devicesResult[i.id] = {
                        tag: i.tag,
                        type: i.type
                    }
                });
                res.body.hardware = devicesResult;
            }
            res.json(res.body);   
        } 
    });
})

module.exports = router;