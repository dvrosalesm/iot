var express = require('express');
var router = express.Router();
var logger = require('../core/logger');
var moment = require('moment');
var IOMiddleware = require('../core/io_middleware');
var eventModel = require('../core/models/event_model');
var uuid = require("uuid").v4;

router.post('/', IOMiddleware, (req, res) => {
    if(!req.body.create) {
        common.errorResponse(res, "Inputs faltantes");
        logger.logInteraction(req, res, res.body);
        res.json(res.body);
    } else {
        req.body.create.external = req.body.create.if.left.url.includes(process.env.service_url); 
        req.body.create.idEvent = uuid();
        eventModel.create(req.body.create);
        res.body.idEvent = req.body.create.idEvent;
        logger.logInteraction(req, res, res.body);
        res.json(res.body);
    }

})

module.exports = router;
