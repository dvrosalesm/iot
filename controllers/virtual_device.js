const bodyParser = require('body-parser')
var express = require('express')
const logger = require('../core/logger')
var vd = require('../core/vdmapper')
var router = express.Router()
var storage = require('../core/storage')

router.post('/', bodyParser.text(), (req, res) => {
    
    let currentStatus = req.body
    let nextStatus = currentStatus

    if(storage.get("vd") === null || storage.get("vd") === "") {storage.set("vd", nextStatus) }
    else {
        vd.convertToFlags(nextStatus)

        let slider0Input = vd.SLIDER0;
        let slider1Input = vd.SLIDER1;
        let switch0Input = vd.SWITCH0;

        vd.convertToFlags(storage.get("vd"))
        vd.SLIDER0 = slider0Input;
        vd.SLIDER1 = slider1Input;
        vd.SWITCH0 = switch0Input;

        nextStatus = vd.convertToHex()
        storage.set("vd", nextStatus)
    }
    logger.logInfo(vd)
    res.set({'Content-Type': 'text/plain'})
    res.send(nextStatus)
})

module.exports = router