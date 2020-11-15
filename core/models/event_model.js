const mongoose = require('mongoose');
const connectionCheck = require('./connectionCheck');
var common = require('../common');

connectionCheck();

let eventSchema = mongoose.Schema({
    "if": {
        "left": {
            "url": String,
            "id": String,
            "freq": Number 
        },
        "condition": String,
        "right": {
            "sensor": Number,
            "status": Boolean,
            "text": String
        }
    },
    "then": {
        "url": String,
        "id": String,
        "status": String,
        "text": String
    },
    "else": {
        "url": String,
        "id": String,
        "status": String,
        "text": String
    },
    "idEvent": String,
    "external": Boolean
});

module.exports = mongoose.model('Event', eventSchema);