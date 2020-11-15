var express = require('express');
var router = express.Router();
var IOMiddleware = require('../core/io_middleware');
var eventModel = require('../core/models/event_model');
var logger = require('../core/logger');

router.post('/', IOMiddleware, (req, res) => {

    if(!(req.body.update && req.body.update.id)) {
        common.errorResponse(res, "Inputs faltantes");
        logger.logInteraction(req, res, res.body);
        res.json(res.body);
    } else {

        eventModel.findOne({idEvent: req.body.update.id}).exec((err, data) => {

            if(data !== null) {
                
                if(req.body.update.if) {
                    data.external = req.body.update.if.left.url.includes("iot-9b4eg.ondigitalocean.app"); 
                    data.if = req.body.update.if;
                }

                if(req.body.update.then) {
                    data.then = req.body.update.then;
                }

                if(req.body.update.else) {
                    data.else = req.body.update.else;
                }

                data.save();
                logger.logInteraction(req, res, res.body);
                res.json(res.body);
            } else {
                common.errorResponse(res, "Evento no existe");
                logger.logInteraction(req, res, res.body);
                res.json(res.body);
            }

        })
        
    }

})

module.exports = router;