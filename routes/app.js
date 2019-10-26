/* eslint radix: ["error", "as-needed"] */
function bulkAPI(req, res, dbs) {
  let query = {};
  if (typeof req.query.sd !== 'undefined') {
    query = {
      date: {
        $gte: new Date(parseInt(req.query.sd)),
      },
    };
  }
  dbs.find(query).toArray((err, docs) => {
    const data = [];
    if (docs !== null) {
      for (let i = 0; i < docs.length; i += 1) {
        const struct = {
          0: docs[i].download,
          1: docs[i].upload,
          2: docs[i].ping,
        };
        for (let j = 0; j < 3; j += 1) {
          const dataPoint = {
            // eslint-disable-next-line no-underscore-dangle
            id: docs[i]._id + j,
            x: docs[i].date,
            y: struct[j],
            group: j,
          };
          data.push(dataPoint);
        }
      }
    }
    res.send(JSON.stringify(data));
  });
}

async function avgAPI(req, res, dbs) {
  const endDate = (typeof req.query.end !== 'undefined') ? new Date(parseInt(req.query.end)) : new Date();
  const afterDate = (typeof req.query.start !== 'undefined') ? new Date(parseInt(req.query.start)) : 0;

  const query = [{
    $match: {
      date: {
        $gte: afterDate,
        $lte: endDate,
      },
    },
  }, {
    $group: {
      _id: 'speedtest',
      avgd: {
        $avg: '$download',
      },
      avgu: {
        $avg: '$upload',
      },
      avgp: {
        $avg: '$ping',
      },
    },
  }];

  dbs.aggregate(query).toArray((err, docs) => {
    res.send(docs);
  });
}

module.exports = (app, dbs) => {
  app.get('/api/', (req, res) => {
    bulkAPI(req, res, dbs);
  });

  app.get('/api/avg/', (req, res) => {
    avgAPI(req, res, dbs);
  });

  return app;
};
