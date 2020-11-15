const mongoose = require('mongoose');
const connectionCheck = require('./connectionCheck');
var common = require('../common');

connectionCheck();

let executedSchema = mongoose.Schema({
    "idEvent": String,
    "result": Boolean,
    "changed": {
        "url": String,
        "id": String,
        "status": Boolean,
        "text": String
    },
    "onError": String
});

module.exports = mongoose.model('Executed', executedSchema);