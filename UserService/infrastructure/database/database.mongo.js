require('dotenv').config();
const mongoose = require('mongoose');

const username = process.env.DB_MONGO_USERNAME;
const password = process.env.DB_MONGO_PASSWORD;
const cluster = process.env.DB_MONGO_CLUSTER;
const dbname = process.env.DB_MONGO_NAME;

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.z33uh2k.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const database = mongoose.connection.useDb('db_nuranggi_betest');

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

module.exports = database