# Internet Speed Logger

_A simple application to track your internet download and upload speeds, along with latency, over many years._

![Preview of Internet Speed Logger](https://ookla.d.pr/Zl5kJP+)

This is a simple application which continuously monitors your internet connection and plots the results within a responsive web view along with providing basic average metrics. This leverages the official Speedtest.net CLI binary from Ookla to provide the best performance possible.

An early version of this service has been run for many years and has been instrumental for tracking internet performance changes.

To bring it online, simply run:
```
git clone https://github.com/brennentsmith/internet-speed-logger.git
cd internet-speed-logger
docker compose up
```
Go to `http://localhost:3000` in your browser, and away you go!

## Configuration

All configuration is held within the `/config/default.js` directory. The following options are available:

| Leaf | Default | Description |
<<<<<<< HEAD
| --- | --- | --- |
| `webserver.listenPort` | `3000` | Port which the webserver will listen on. |
| `webserver.listenHost` | `0.0.0.0` | Host which the webserver will listen on. |
| `db.connectionString` | `mongodb://speedtest:speedtest@mongo:27017/speedtest` | Connection string the connection for the backend MongoDB compliant database. |
| `db.collection` | `speedtest` | Collection to use within MongoDB compliant database. 
| `speedtest.commandString` | `bin/speedtest -f json --accept-license` | Raw command to execute to perform speed test. Change this if you want it on a different path or specify a specific server. |
| `speedtest.intervalSec` | `43200` | Interval for which the speedtest will be run. This will be randomly skewed +/- 25% and floored at 1800 seconds. |
=======
| -- | -- | -- |
| `webserver.listenPort`      | `3000`       | Port which the webserver will listen on   |
| `webserver.listenHost`      | `0.0.0.0`       | Host which the webserver will listen on   |
| `db.connectionString`   | `mongodb://speedtest:speedtest@mongo:27017/speedtest`        | Connection string the connection for the backend MongoDB compliant database. See: [Connection String URI Format](https://docs.mongodb.com/manual/reference/connection-string/)      |
| `db.collection`      | `speedtest`       | Collection to use within MongoDB compliant database.   |
| `speedtest.commandString`      | `bin/speedtest -f json --accept-license`       | Raw command to execute to perform speed test. Change this if you want it on a different path or specify a specific server.   |
| `speedtest.intervalSec`      | `43200`       | Interval for which the speedtest will be run. This will be randomly skewed +/- 25% and floored at 1800 seconds.   |
>>>>>>> 1c71283bcc75941ac054fb174c7c7764bc33f819
