const mongoose = require('mongoose');
const connectionCheck = require('./connectionCheck');

var common = require('../common');

connectionCheck();

let deviceSchema = new mongoose.Schema({
    id: String,
    tag: String,
    type: String,
    status: String
})

let hardwareSchema = new mongoose.Schema({
    date: { type : Date, default: common.getCurrentDate() },
    devices: [deviceSchema]    
});

module.exports = mongoose.model('Hardware', hardwareSchema);