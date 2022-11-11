require('dotenv').config();
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;


const username = "root";
const password = "root";
const cluster = "dbnuranggibetest";
const dbname = "db_nuranggi_betest";

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