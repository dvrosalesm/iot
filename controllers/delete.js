var express = require('express');
var router = express.Router();
var IOMiddleware = require('../core/io_middleware');
var eventModel = require('../core/models/event_model');
var logger = require('../core/logger');

router.post('/', IOMiddleware, (req, res) => {
    if(!req.body.delete) {
        common.errorResponse(res, "Inputs faltantes");
        logger.logInteraction(req, res, res.body);
        res.json(res.body);
    } else {
        eventModel.findOneAndDelete({idEvent: req.body.delete.id}, (err, data) => {
            logger.logInteraction(req, res, res.body);
            res.json(res.body)
        })
    }
})

module.exports = router;