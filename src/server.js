'use strict';

const express = require('express');
const app = express();
let bodyParser = require('body-parser');
let ejs = require('ejs');
let pg = require('pg');

let votes = {
    sandwiches: 0,
    tacos: 0
};

let client = new pg.Client("postgres://postgres@172.17.0.2:5432/postgres");
client.connect(function (err) {
    if (err) throw err;

    client.query("select option, votes from votes;", function (err, result) {
        if (err) throw err;

        result.rows.map(function(e, i) {
            console.log(e);
            switch (e.option) {
                case "tacos" : votes.tacos = e.votes; break;
                case "sandwiches" : votes.sandwiches = e.votes; break;
            }
        })
    })
});


let urlencodedParser = bodyParser.urlencoded({extended:false});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
    res.render('pages/index', {
        votes: votes
    });
});

function errThrower(err, res) { if (err) throw err; }
function errLogger(err, res) { if (err) console.log(err.stack); }

const updateTacosQuery = "update votes set votes = $1 where option = 'tacos'";
const updateSandwicheQuery = "update votes set votes = $1 where option = 'sandwiches'";
function updateDatabase(inVotes) {
    client.query(updateTacosQuery, [inVotes.tacos], errLogger);
    client.query(updateSandwicheQuery, [inVotes.sandwiches], errLogger);
    console.log("Updated with " + inVotes);
}

app.post('/vote', urlencodedParser, (req, res) => {
    let vote = req.body.yourVote;
    if (vote === 'sandwiches') {
        votes.sandwiches = votes.sandwiches + 1;
    }
    else if (vote === 'tacos') {
        votes.tacos = votes.tacos + 1;
    }
    else {
        console.log("Somethign went wrong, value of vote wasn't any recognized elemnts, but was " + vote);
    }
    updateDatabase(votes);
    res.redirect("/");
});

const PORT = 8888;
app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
