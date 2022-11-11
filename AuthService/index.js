
'user srtict'

require('dotenv').config();

const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.APP_PORT;

// const mongoose = require('mongoose');
const mongoose = require('./infrastructure/database/database.mongo');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ============================== ROUTES API ==============================
const router = express.Router()
const authRoute = require("./app/routes/auth.routes");

//route v1
app.use('/api/v1/', router);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Auth Services.",
  });
});

app.use((req, res, next) => {
  res.status(404).json({
      message: 'Ohh you are lost, read the API documentation to find your way back home :)'
  })
})

router.use('/user', authRoute)

app.listen(port, () => {
  console.log(`User Services app listening on port ${port}`)
})
