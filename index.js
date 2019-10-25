var path = require('path');
var config = require('config');
var express = require('express');
var mongodb = require('mongodb');
var compression = require('compression');
var morgan = require('morgan')

var listenPort = config.get('webserver.listenPort')
var app = express();
app.use(morgan('combined'))

var mongoUrl = config.get('db.connectionString');
var mongoDb = config.get('db.db');
var mongoCollection =config.get('db.collection');
var MongoClient = mongodb.MongoClient;

app.enable('etag');
app.use(compression());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.get('/api/', function(req, res) {
    printAPI(req, res);
});

app.get('/api/avg/', function(req, res) {
    printAverages(req, res);
});

// Static delivery
app.use('/styles/', express.static(path.join(__dirname + '/styles')));
app.use('/scripts/', express.static(path.join(__dirname + '/scripts')));
app.use('/scripts/vis/', express.static(path.join(__dirname + '/node_modules/vis/dist/')));
app.use('/scripts/jquery/', express.static(path.join(__dirname + '/node_modules/jquery/dist/')));

app.listen(listenPort, function() {
    console.log(`Speedlogger webserver is now listening on port ${listenPort}`);
});

function printAPI(req, res) {
    MongoClient.connect(mongoUrl, function(err, client) {
        if (err) {
            console.error('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var db = client.db(mongoDb);
            var collection = db.collection(mongoCollection);
            if (typeof req.query.sd !== 'undefined'){
            	query = {
            		date:{
            			$gte: new Date(parseInt(req.query.sd))
            		}
            	}
            }else{
            	query = {}
            }
            collection.find(query).toArray(function(err, docs) {
                client.close();
                var data = [];
                if (docs !== null){
	                for (i = 0; i < docs.length; i++) {
	                    for (j = 0; j < 3; j++) {
	                        if (j == 0) {
	                            y = docs[i].download;
	                        } else if (j == 1) {
	                            y = docs[i].upload;
	                        } else {
	                            y = docs[i].ping;
	                        }
	                        var dataPoint = {
	                            "id": docs[i]._id + j,
	                            "x": docs[i].date,
	                            "y": y,
	                            "group": j
	                        }
	                        data.push(dataPoint);
	                    }
	                }
	            }
                res.send(JSON.stringify(data));
            });
        }
    });
}

function printAverages(req, res) {

	endDate = (typeof req.query.ed !== undefined) ? new Date(parseInt(req.query.ed)) : new Date();
	afterDate = (typeof req.query.sd !== undefined) ? new Date(parseInt(req.query.sd)) : 0;
    MongoClient.connect(mongoUrl, function(err, client) {
        if (err) {
            console.error('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var db = client.db('speedtest');
            var collection = db.collection('speedtest');
            var query = [{
              $match: {
                  'date': {
                      $gte: afterDate,
                      $lte: endDate
                  }
              }
          }, {
              $group: {
                  _id: "speedtest",
                  avgd: {
                      $avg: "$download"
                  },
                  avgu: {
                      $avg: "$upload"
                  },
                  avgp: {
                      $avg: "$ping"
                  }
              }
          }]

            collection.aggregate(query).toArray(function(error, docs) {
              client.close();
              res.send(docs);
            });
        }
    });
}