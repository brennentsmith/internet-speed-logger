var config = require('config');
var mongodb = require('mongodb');
var exec = require('child_process').exec;

var cmd = config.get('speedtest.commandString');
var minimumIntervalS = 1800;
var intervalS = Math.max(config.get('speedtest.intervalSec'), minimumIntervalS)
var intervalMS = intervalS * 1000

var mongoUrl = config.get('db.connectionString');
var mongoDb = config.get('db.db');
var mongoCollection =config.get('db.collection');
var MongoClient = mongodb.MongoClient;

var isDaemon = process.argv[2] == "daemon";

function getDelay(interval) {
  return Math.floor( interval * Math.random() * (1.25 - 0.75) + 0.75);
}

function makeRequest() {
  exec(cmd, processOutput);
}

function processOutput (error, stdout, stderr){
  if (stderr) {
    console.log(stderr)
  }
  if (error) {
		console.log(error);
	} else {
    try{
      var data = JSON.parse(stdout);
      insertData(data);
    } catch (e) {
      console.log(e);
    }
  }
  if (isDaemon) {
    // No matter if there is an error, re-schedule.
    delay = getDelay(intervalMS);
    setTimeout(makeRequest, delay);
  }
}

function insertData(result) {
	MongoClient.connect(mongoUrl, function (err, client) {
	  if (err) {
	    console.error('Unable to connect to the mongoDB server. Error:', err);
	  } else {
      var db = client.db(mongoDb);
	    var collection = db.collection(mongoCollection);
	    var byteToMbit = 0.000008;
	    var timestamp = result.timestamp;;
	    var ping = result.ping.latency;
      var download = result.download.bandwidth * byteToMbit;
      var upload = result.upload.bandwidth * byteToMbit;
	    var speedtestResult = {date: new Date(timestamp), ping: ping, download: download, upload: upload};

	    collection.insertOne(speedtestResult, function (err) {
			if (err) {
				console.error(err);
			} 
			client.close();
	    });
	  }
	});
}

makeRequest();