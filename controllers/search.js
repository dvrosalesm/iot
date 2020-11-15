var express = require('express');
var router = express.Router();
var hardwareModel = require('../core/models/hardware_model');
var IOMiddleware = require('../core/io_middleware');
var common = require('../core/common');
var vd = require('../core/vdmapper');
var logger = require('../core/logger');
var moment = require('moment');

router.post('/', IOMiddleware, (req, res) => {


    if( !(req.body.search && req.body.search.start_date && req.body.search.finish_date && req.body.search.id_hardware) ) {
        common.errorResponse(res, "Inputs faltantes");
        logger.logInteraction(req, res, res.body);
        res.json(res.body);
    } else if(vd.getTypeById(req.body.search.id_hardware) === "na") {
        common.errorResponse(res, "Id de sensor no reconocido");
        logger.logInteraction(req, res, res.body);
        res.json(res.body);
    } else {
        let requestedStartDateValid = moment(req.body.search.start_date).isValid();
        let requestedFinalDateValid = moment(req.body.search.finish_date).isValid();

        if(requestedStartDateValid && requestedFinalDateValid) {
            hardwareModel.find({
                date: { $gte: req.body.search.start_date, $lte: req.body.search.finish_date}
            }).exec((err, data) => {

                if(data) {
                    var devicesResult = {};
                    data.map(i => {
                        if(i.devices) {
                            i.devices.map(j => {
                                if(j.id === req.body.search.id_hardware) {
                                    devicesResult[common.formatDate(i.date)] = vd.deviceToNL(j.id, j);
                                }
                            });
                        }
                    })

                    let type = vd.getTypeById(req.body.search.id_hardware);
                    res.body.search = {
                        "id_hardware": req.body.search.id_hardware,
                        "type": type
                    }

                    res.body.data = devicesResult;
                }

                logger.logInteraction(req, res, res.body);
                res.json(res.body)
            })

        } else {
            common.errorResponse(res, "Fechas invalidas");
            logger.logInteraction(req, res, res.body);
            res.json(res.body);
        }
    }

    
})

module.exports = router;