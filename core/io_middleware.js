var common = require('./common');

module.exports = function(req, res, next) {
    res.set({'Content-Type': 'application/json'})
    res.body = {
        id: "CongeladorIoT_DR17002913",
        url: process.env.service_url,
        date: common.getCurrentDate(),
        status: "OK"
    }
    next()
}
