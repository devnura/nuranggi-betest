const express = require("express");
const router = express.Router();
const axios = require("axios")
// router.get("/login",(req, res) => {return res.json({})});

router.post("/login", async (req, res) => {
  try {
    let serviceUrl = `${process.env.AUTH_SERVICE_URL}/api/v1/auth/login`
    
    req.isAuthenticate = true
    const response = await axios.post(serviceUrl, req.body, {headers: {
      'fromgateway' : true
    }})

    return res.status(response.status).json(response.data)
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

router.post("/register", async (req, res) => {
  try {
    let serviceUrl = `${process.env.AUTH_SERVICE_URL}/api/v1/auth/register`
    
    req.isAuthenticate = true
    const response = await axios.post(serviceUrl, req.body, {headers: {
      'fromgateway' : true
    }})

    return res.status(response.status).json(response.data)
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

router.get("/validate-token", async (req, res) => {
    try {
      let serviceUrl = `${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`

      const response = await axios.get(serviceUrl, {
        headers: {
          Authorization: `${req.headers["authorization"]}`,
          fromgateway : true
        }
      })

      return res.status(response.status).json(response.data)
    } catch (error) {
      return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
    }
});

router.get("/logout", async (req, res) => {
  try {
    let serviceUrl = `${process.env.AUTH_SERVICE_URL}/api/v1/auth/logout`

    const response = await axios.get(serviceUrl, {
      headers: {
        Authorization: `${req.headers["authorization"]}`,
        fromgateway : true
      }
    })

    return res.status(response.status).json(response.data)
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

module.exports = router