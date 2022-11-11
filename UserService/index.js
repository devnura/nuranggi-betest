
'user srtict'

require('dotenv').config();

const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3002

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

router.use('/user', userRoute)

// app.post("/insert", async (req, res) => {
//   const foodName = req.body.foodName;
//   const days = req.body.days;
//   const food = new FoodModel({ foodName: foodName, daysSinceIAte: days });
//   try {
//     await food.save();
//     res.send("data inserted");
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.put("/update", async (req, res) => {
//   const newFoodName = req.body.newFoodName;
//   const id = req.body.id;

//   try {
//     await FoodModel.findById(id, (err, updatedFood) => {
//       updatedFood.foodName = newFoodName;
//       updatedFood.save();
//       res.send("update");
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/read", async (req, res) => {
//   FoodModel.find({}, (err, result) => {
//     if (err) {
//       res.send(err);
//     }
//     res.send(result);
//   });
// });

// app.delete("/delete/:id", async (req, res) => {
//   const id = req.params.id;
//   await FoodModel.findByIdAndRemove(id).exec();
//   res.send("deleted");
// });

app.listen(port, () => {
  console.log(`User Services app listening on port ${port}`)
})
