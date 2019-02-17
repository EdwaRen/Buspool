const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fs = require('fs');
var path = require('path');

const db_cred = JSON.parse(fs.readFileSync('db_credentials.json'));
// let port = process.env.PORT || 80;
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

mongoose.connect('mongodb://localhost:27017/busroutes', {useNewUrlParser: true});

const User = mongoose.model('users', new mongoose.Schema({

    start: {
        lat: Number,
        lng: Number
    },
    end: {
        lat: Number,
        lng: Number
    }
}));

app.get('/addRoute', function(req, res){
    let {startLat, startLng, endLat, endLng} = req.query;
    let obj = {
        start: {
            lat: startLat,
            lng: startLng
        },
        end: {
            lat: endLat,
            lng: endLng
        }
    };

    let newUser = new User(obj);
    newUser.save(function(err, res){
        if(err) console.log(err);
    });


    const { spawn } = require('child_process');
    const pyProg = spawn('python3', ['kmeans.py']);
    console.log("pyProg launched");

    pyProg.stdout.on('data', function(data) {
        console.log("logging data");
        console.log(data.toString());
        // res.write(data);
        res.end('end');
    });
    console.log("end detected");

});

app.get('/getRoutes', function(req, res){
    res.send("get routes");
    res.sendFile(path.join(__dirname + '/index.html'));

});

app.post('/locationRequest', function(req, res){
    console.log(req.body);
    // console.log(req.body[0]);

    // res.send("location request")
    res.sendFile(path.join(__dirname + '/index.html'));

});

// app.listen(port);

app.listen(8080, function() {
  console.log('server stared on port 8080')
});