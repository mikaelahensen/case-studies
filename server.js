const MongoClient = require('mongodb').MongoClient;
const contentful = require("contentful");
const schedule = require('node-schedule');
const express = require('express');
const app = express();

var db; 

// Initialize connection once
MongoClient.connect('mongodb://mikaelahensen:bkh13097@ds125031.mlab.com:25031/sandbox', function(err, database) {
  if(err) throw err;

  db = database.db('sandbox');

  app.listen(3000);
  console.log('Listening on port 3000');
});

var client = contentful.createClient({
  space: 'u3hhiittxlc9',
  accessToken: 'e7cc26e70a254a29288c97aa802291500880c3a7543ef4da543d60e70801708f'
});

schedule.scheduleJob('* * 01 * * *', function() {
  console.log('Scheduled job worked');
  client.getEntries()
    .then(function(entries) {
      // remove all objects in collection
      db.collection('sogetiCaseStudies').remove( { } )
        .then(function(response) {
          db.collection('sogetiCaseStudies').insert([entries]);
        });
    });
});

// get all case studies
app.get('/case-studies',(req, res) => {
  db.collection('sogetiCaseStudies').find().toArray((err, docs) => {
    if (err) {
      console.log(err)
      res.error(err)
    } else {
      res.json(docs)
    }
  });
});