var express = require('express');
var logger = require('../core/logger');
var IOMiddleware = require('../core/io_middleware');
var hardwareModel = require('../core/models/hardware_model');
var router = express.Router();

router.post('/', IOMiddleware, (req, res) => {
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
            logger.logInteraction(req, res, res.body);
            res.json(res.body);   
        } 
    });
})

module.exports = router;