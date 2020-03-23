const config = require('config');
const { MongoClient } = require('mongodb');

const mongoUrl = config.get('db.connectionString');

function connect(url) {
  return MongoClient.connect(url, {
    poolSize: 10,
  });
}

module.exports = async () => {
  const database = await Promise.all([connect(mongoUrl)]);
  return database[0].collection(config.get('db.collection'));
};
