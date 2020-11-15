var LocalStorage = require('node-localstorage');
localStorage = new LocalStorage('./_data/transient_requests');

const storage = {
    setItem: (key, obj) => localStorage.setItem(key, obj),
    getItem: (key) => localStorage.getItem(key),
    removeItem: (key) => localStorage.removeItem(key)
}

module.exports.get = storage.setItem;
module.exports.set = storage.getItem;
module.exports.remove = storage.removeItem;