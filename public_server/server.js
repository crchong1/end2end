const express = require('express')
const app = express()
const port = 3002
var session = require('express-session');
let db = require('./db.js')
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({secret: 'secret'}));
app.use(express.static('static'));

app.get('/', (req, res) => res.send('Hello World!'))

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

app.post('/registerClient', function(req, res) {
  let username = req.body.username;
  let userAddress = req.body.userAddress;
  let keyBundle = req.body.keyBundle;
  db.putClient(username, userAddress, keyBundle, function(data, err) {
    if(err){
      res.send("ERROR");
    } else {
      res.send("SUCCESS");
    }
  });
});

// /getClients : get all listed client ids 
// /registerClient : list client and a new key bundle


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
