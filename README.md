# Internet Speed Logger

_An application to track your internet download and upload speeds with an elegant web interface._

![Preview of Internet Speed Logger](https://i.imgur.com/LhtHxpZ.gif)

This is a time series based application which continuously monitors your internet connection and plots the results within a responsive web view along with providing basic aggregation of the current visible timeframe (mean). This leverages the [official Speedtest.net CLI binary](https://www.speedtest.net/apps/cli) from Ookla to provide the best performance possible.

An early version of this service has been running for many years (~2016) and it has been instrumental for tracking internet performance issues.

## Components

The requrements for Internet Speed Logger are:

- Node.js >= v12.0.0
- MongoDB

There are three core components to running Internet Speed Logger:

- Webserver (`index.js`) - Webserver which delivers static assets and provides API.
- Speedrunner (`run-speedtest.js`) - Daemon or One Shot process which performs the internet speed test.
- MongoDB - "Web Scale" persistence layer. 😜

The Webserver and MongoDB must always be running, however the Speedrunner can be either run as a daemon `./run-speedtest.js daemon` or invoked via a schedule as a oneshot process `./run-speedtest.js`. Both the Webserver and Speedrunner share the common config within `config/default.js`.

## Configuration

All configuration is held within the `config/default.js` file. The following options are available:

| Leaf                      | Default                                               | Description                                                                                                                                                                    |
| ------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `webserver.listenPort`    | `3000`                                                | Port which the webserver will listen on                                                                                                                                        |
| `webserver.listenHost`    | `0.0.0.0`                                             | Host which the webserver will listen on                                                                                                                                        |
| `db.connectionString`     | `mongodb://speedtest:speedtest@mongo:27017/speedtest` | Connection string the connection for the backend MongoDB compliant database. See: [Connection String URI Format](https://docs.mongodb.com/manual/reference/connection-string/) |
| `db.collection`           | `speedtest`                                           | Collection to use within MongoDB compliant database.                                                                                                                           |
| `speedtest.commandString` | `bin/speedtest -f json --accept-license`              | Raw command to execute to perform speed test. Change this if you want it on a different path or specify a specific server.                                                     |
| `speedtest.intervalSec`   | `43200`                                               | Interval for which the speedtest will be run. This will be randomly skewed +/- 25% and limited to no less than 1800 (30 minutes) seconds between runs.                         |

## Running Internet Speed Logger

### Container

The images are published to GitHub Packages, and it contains both the webserver and test daemon.

```bash
git clone https://github.com/jeffbyrnes/internet-speed-logger.git
cd internet-speed-logger
docker compose up
```

In case you see errors from mongodb with:

```plain
mongodb | mkdir: cannot create directory '/bitnami/mongodb': Permission denied
mongodb exited with code 1
```

Try to set the persistent data directory rights:

```bash
docker compose down
chown -R 1001 mongo-persistence/
docker compose up
```

You may see some errors upon boot:

```plain
speedlogger-web_1     | MongoNetworkError: failed to connect to server
```

these are normal as the web service will attempt to create the connection pool before MongoDB is ready. Once MongoDB is ready (~30s), all will work correctly.

### Using Forever to run locally

Install the following:

- [Node.js](https://nodejs.org/en/download/package-manager/)
- [MongoDB](https://docs.mongodb.com/manual/installation/)

```bash
git clone https://github.com/jeffbyrnes/internet-speed-logger.git
cd internet-speed-logger
# download latest version of Speedtest-CLI binary to `bin` dir within repo >>
npm ci
npm run webserver-daemon
npm run speedtest-daemon
```

## Updating

To get the latest Docker image, run:

```bash
docker compose stop
docker compose pull
docker compose up
```
