var moment = require('moment');

module.exports = {
    zeroPadding: function (num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    },
    a2hex: (str) => {
        var arr = [];
        for (var i = 0, l = str.length; i < l; i ++) {
            var hex = Number(str.charCodeAt(i)).toString(16);
            arr.push(hex);
        }
        return arr.join('');
    },
    hex2a: (hexx) => {
        var hex = hexx.toString();
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    },
    getCurrentDate: () => {
        return moment(Date.now()).utc().format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
    },
    formatDate: (date) => {
        return moment(date).utc().format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
    },
    errorResponse: (res, msg) => {
        res.body.status = "ERROR";
        res.body.message = msg;
    }
}