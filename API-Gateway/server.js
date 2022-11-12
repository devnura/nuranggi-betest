
'user srtict'

require('dotenv').config();

const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.APP_PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ============================== ROUTES API ==============================
const router = express.Router()
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");

//route v1
app.use('/service/', router);

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to User Services.",
  });
});

app.use((req, res, next) => {
  res.status(404).json({
      message: 'Ohh you are lost, read the API documentation to find your way back home :)'
  })
})

router.use('/auth', authRoute)
router.use('/user', userRoute)

app.listen(port, () => {
  console.log(`API GATEWAY Services app listening on port ${port}`)
})

