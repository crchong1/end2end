var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/public_dir');
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
    userAddress: {
        type: String,
        required: true,
    },
    keyBundle: {
        type: Object,
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

let putClient = function(username, userAddress, keyBundle, callback) {
    let newClient = new Client({
        username: username,
        userAddress: userAddress,
        keyBundle: keyBundle
    })
    newClient.save(function(err, success){
        if(err) return console.error(err);
        console.log("Successfully saved client");
        callback("SUCCESS", null)
    });
}

var database = { 
    getAllClients: getAllClients,
    getClient: getClient,
    putClient: putClient
};

module.exports = database;