const mongoose = require('mongoose');

let db = "cc8iot";
let password = "fjjzhcpeoLasp5nq";

module.exports = function() {
    if(mongoose.connection.readyState === 0) {
        let connectionString = "mongodb+srv://drosales:" + password + "@cluster0.e5oxf.mongodb.net/" + db + "?retryWrites=true&w=majority";
        mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .catch( (err) => {
            console.log(err);
        });
    }
}