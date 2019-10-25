const MongoClient = require('mongodb').MongoClient
var mongoUrl = config.get('db.connectionString');
 
function connect(url) {
  return MongoClient.connect(url).then(client => client.db())
}
 
module.exports = async function() {
  let database = await Promise.all([connect(mongoUrl)])
  return database
}