var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/end2end_server');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var clientSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

var Client = mongoose.model('Client', clientSchema);

let getAllClients = function(callback){
    Client.find({username: {}}, function(err, res){
        if(err){
            callback(null, "error" + err);
        }
        else {
            callback(res, null);
        }
    });
  };

let getClient = function(username, callback) {
    Client.find({username: username}, function(err, res){
        if(err){
            callback(null, "error" + err);
        }
        else {
            callback(res[0], null);
        }
    });
}

let putClient = function(username, password, callback) {
    let newClient = new Client({
        username: username,
        password: password
    })
    newClient.save(function(err, success){
        if(err) return console.error(err);
        console.log("Successfully saved client");
    });
}

var database = { 
    getAllClients: getAllClients,
    getClient: getClient,
    putClient: putClient
};

module.exports = database;