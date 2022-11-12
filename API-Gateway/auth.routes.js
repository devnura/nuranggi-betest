const express = require("express");
const router = express.Router();
const axios = require("axios")
// router.get("/login",(req, res) => {return res.json({})});

router.post("/login", async (req, res) => {
  try {
    let serviceUrl = `${process.env.AUTH_SERVICE_URL}/api/v1/auth/login`
    
    req.isAuthenticate = true
    const response = await axios.post(serviceUrl, req.body)

    console.log(response.data)
    return res.status(response.status).json(response.data)
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

router.post("/validate-token", async (req, res) => {
    try {
      let serviceUrl = `${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`
      console.log(serviceUrl)
      const response = await axios.post("http://127.0.0.1:3001/api/v1/auth/login", req.body)
    //   const response = await axios.get({
    //       method: 'post',
    //       url: "http://127.0.0.1:3001/api/v1/auth/login",
    //       data:req.body
    //   })
      console.log(response.data)
      return res.status(response.status).json(response.data)
    } catch (error) {
      console.log(error)
      return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
    }
  });

module.exports = router