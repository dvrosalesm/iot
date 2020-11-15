const bodyParser = require('body-parser')
var express = require('express')
const logger = require('../core/logger')
var vd = require('../core/vdmapper')
var router = express.Router()

router.post('/', bodyParser.text(), (req, res) => {
    
    let currentStatus = req.body;
    vd.convertToFlags(currentStatus);

    logger.logInfo(vd);

    res.set({'Content-Type': 'text/plain'})
    res.send(currentStatus)
})

module.exports = router