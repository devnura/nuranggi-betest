
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
const userRoute = require("./app/routes/user.routes");

//route v1
app.use('/api/v1/', router);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to User Services.",
  });
});

app.use((req, res, next) => {
  res.status(404).json({
      message: 'Ohh you are lost, read the API documentation to find your way back home :)'
  })
})
const auth = require("./app/middleware/middleware")
router.use('/user', auth.isAuthenticate, userRoute)

app.listen(port, () => {
  console.log(`User Services app listening on port ${port}`)
})
