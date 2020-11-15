var common = require('./common');

module.exports = function(req, res, next) {
    res.set({'Content-Type': 'application/json'})
    res.body = {
        id: "CongeladorIoT_DR17002913",
        url: "https://iot-9b4eg.ondigitalocean.app",
        date: common.getCurrentDate(),
        status: "OK"
    }
    next()
}