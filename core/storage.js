var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./core/_data');

const storage = {
    setItem: (key, obj) => localStorage.setItem(key, obj),
    getItem: (key) => localStorage.getItem(key),
    removeItem: (key) => localStorage.removeItem(key)
}

module.exports.get = storage.getItem;
module.exports.set = storage.setItem;
module.exports.remove = storage.removeItem;