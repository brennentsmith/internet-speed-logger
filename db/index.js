const config = require('config');
const { MongoClient } = require('mongodb');

const mongoUrl = config.get('db.connectionString');

async function connect(url) {
  const client = await MongoClient.connect(url);
  return client.db();
}

module.exports = async () => {
  const database = await Promise.all([connect(mongoUrl, {
    poolSize: 10,
  })]);
  return database[0].collection(config.get('db.collection'));
};
