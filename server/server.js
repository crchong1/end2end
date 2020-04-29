const express = require('express')
const app = express()
const port = 3001
var session = require('express-session');
let db = require('./db.js')
var bodyParser = require('body-parser');
var argon2i = require('argon2-ffi').argon2i;
var crypto = require('crypto');
const socketIo = require("socket.io");
const http = require("http");

var server = app.listen(port)

var io = require('socket.io').listen(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var cors = require('cors');
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(session({secret: 'secret2'}));
app.use(express.static('static'));

io.on('connection', function (client) {
  console.log('client connected...', client.id)

  client.on('register', () => {

  })

  client.on('join', () => {
    
  })

  client.on('leave', () => {
    
  })

  client.on('message', () => {
    
  })

  client.on('chatrooms', () => {
    
  })

  client.on('availableUsers', () => {
    
  })

  client.on('disconnect', () => {
    console.log('client disconnect...', client.id);
  })

  client.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})

// io.on('connection', function(socket){
//   console.log("connected")
//   socket.emit('request', /* */); // emit an event to the socket
//   io.emit('broadcast', /* */); // emit an event to all connected sockets
//   socket.on('reply', function(){ /* */ }); // listen to the event
// });



app.get('/', (req, res) => res.send('Welcome to the backend server'))

app.post('/registerClient', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  crypto.randomBytes(32, function(err, salt) {
    if(err) throw errl
    argon2i.hash(password, salt).then(hash => {
      db.putClient(username, hash, function(data, err) {
        if(err){
          res.send("ERROR");
        } else {
          res.send("SUCCESS");
        }
      });
    })
  });
});

app.post('/login', function(req, res) {
  let username = req.body.username;
  let password = new Buffer(req.body.password);
  db.getClient(username, function(data, err) {
    db_hash = data.password;
    argon2i.verify(db_hash, password).then(correct => {
      if(correct) {
        res.send("SUCCESS");
      } else {
        res.send("ERROR");
      }
    });
  });
});

app.post('/getAllClients', function (req, res) {
  db.getAllClients(function(data, err) {
    res.send(data);
  }); 
})

app.post('/getClient', function (req, res) {
  let username = req.body.username;
  db.getClient(username, function(data, err) {
    res.send(data);
  });
})

console.log(`Example app listening at http://localhost:${port}`)