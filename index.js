var express = require('express');
var mustacheExpress = require('mustache-express');
var request = require('request');
const bodyParser = require('body-parser'); 
var { Client } = require('pg');
const { createCanvas, loadImage }  = require('canvas');
var fs = require('fs');
var connectionString = process.env.DATABASE_URL;
//'postgres://vvccboedpnfrwz:d5112736a828712297b8e2d0043629df29fe74b590bd5b865198a70f7403b560@ec2-23-23-92-204.compute-1.amazonaws.com:5432/d2bt6ppaqap0hc';


var app = express();
var port = process.env.PORT || 8002;
var allWishes = [];

var client = new Client({
    database:'wishes',
    connectionString: connectionString,
    // ssl:true,
});
client.connect();



// next 3 lines set up mustache
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(bodyParser.urlencoded({ extended: true }));

// get data.json -> ajax

app.get("/", function (req, res) {

    app.use(express.static('static'));
    
    client.query('SELECT * FROM wish', function (err, res0) {
        if (err) {
            console.log(err.stack);
        }
        allPosts = res0.rows;
        for(var i = 0 ; i < res0.rows.length; i++){
            allWishes[i] = res0.rows[i].message;
            console.log( i + ':::' +  allWishes[i]);

        }

        res.render('static/index', {
            "postContent": allPosts,
            "post": function () {
                return this.message;
            }
        });

        

    });
    console.log('Forum Loaded');
});

app.post('/update', function (req, res) {
    var newPost = req.body.textarea;
    console.log(newPost);

    client.query("INSERT INTO wish (message) VALUES ('" + newPost + "')"), function (err, res) {
        if (err) {
            console.log(err.stack);
        }
    }
    res.status(204).send();
});

app.listen(port);

