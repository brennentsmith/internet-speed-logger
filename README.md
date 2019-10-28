# Internet Speed Logger

_A simple application to track your internet download and upload speeds with an elegant web interface._

![Preview of Internet Speed Logger](https://i.imgur.com/LhtHxpZ.gif)

This is a simple application which continuously monitors your internet connection and plots the results within a responsive web view along with providing basic average metrics. This leverages the official Speedtest.net CLI binary from Ookla to provide the best performance possible.

An early version of this service has been run for many years and has been instrumental for tracking internet performance changes.

To bring it online, simply run:
```
git clone https://github.com/brennentsmith/internet-speed-logger.git
cd internet-speed-logger
docker compose up
```
Go to `http://localhost:3000` in your browser, and away you go!

## Components

There are three core components to running Internet Speed Logger:
- Webserver (`/index.js`) - Webserver which delivers static assets and provides API. 
- Speedrunner (`/run-speedtest.js`) - Daemon or One Shot process which performs the internet speed test.
- MongoDB - "Web Scale" persistence layer. 😜

The Webserver and MongoDB must always be running, however the Speedrunner can be either run as a daemon `/run-speedtest.js daemon` or invoked via cron or SystemD timer as a oneshot process `/run-speedtest.js`. Both the Webserver and Speedrunner share the common config within `/config/default.js`.

## Configuration

All configuration is held within the `/config/default.js` directory. The following options are available:

| Leaf | Default | Description |
| -- | -- | -- |
| `webserver.listenPort`      | `3000`       | Port which the webserver will listen on   |
| `webserver.listenHost`      | `0.0.0.0`       | Host which the webserver will listen on   |
| `db.connectionString`   | `mongodb://speedtest:speedtest@mongo:27017/speedtest`        | Connection string the connection for the backend MongoDB compliant database. See: [Connection String URI Format](https://docs.mongodb.com/manual/reference/connection-string/)      |
| `db.collection`      | `speedtest`       | Collection to use within MongoDB compliant database.   |
| `speedtest.commandString`      | `bin/speedtest -f json --accept-license`       | Raw command to execute to perform speed test. Change this if you want it on a different path or specify a specific server.   |
| `speedtest.intervalSec`      | `43200`       | Interval for which the speedtest will be run. This will be randomly skewed +/- 25% and floored at 1800 seconds.   |

## Running Internet Speed Logger

### Container
A container is published to Dockerhub which contains both the webserver and test daemon. This is located on [DockerHub](https://cloud.docker.com/u/brennentsmith/repository/docker/brennentsmith/internet-speed-logger)

```
git clone https://github.com/brennentsmith/internet-speed-logger.git
cd internet-speed-logger
docker compose up
```

### SystemD 
Example Unit files can be found within the `/example-init` directory.

### Forever
```
<< install mongodb https://docs.mongodb.com/manual/installation/ >>
[sudo] npm install forever -g
git clone https://github.com/brennentsmith/internet-speed-logger.git
cd internet-speed-logger
<< download latest version of Speedtest-CLI to `bin` dir within repo >>
forever start index.js
forever start run-speedtest.js daemon
```
