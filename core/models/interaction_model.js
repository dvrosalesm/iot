const mongoose = require('mongoose');
const connectionCheck = require('./connectionCheck');
var common = require('../common');

connectionCheck();

let interactionSchema = new mongoose.Schema({
    date: { type : Date, default: common.getCurrentDate() },
    request: {
        headers: {
            "host": String,
            "accept": String,
            "content-type": String,
            "origin": String
        },
        body: {
            id: String,
            url: String,
            date: String,
            data: String
        }
    },
    response: {
        headers: {
            "host": String,
            "accept": String,
            "content-type": String,
            "origin": String
        },
        body: {
            id: String,
            url: String,
            date: String,
            data: String,
            exception: String
        }
    }
});

module.exports = mongoose.model('Interaction', interactionSchema);