// db_connect.js
let mongoose = require('mongoose');
let envConfig = require('./env');

mongoose.connect(envConfig.mongoURI, {
  useMongoClient: true
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connection initiated....')
});

module.exports = db;
