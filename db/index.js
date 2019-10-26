const config = require('config');
const { MongoClient } = require('mongodb');

const mongoUrl = config.get('db.connectionString');

function connect(url) {
  return MongoClient.connect(url).then((client) => client.db());
}

module.exports = async () => {
  const database = await Promise.all([connect(mongoUrl, {
    poolSize: 10,
  })]);
  return database[0].collection(config.get('db.collection'));
};
