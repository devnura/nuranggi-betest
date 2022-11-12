const express = require("express");
const router = express.Router();
const axios = require("axios")
const client = require("./redis")

router.get("/", async (req, res) => {
  try {

    const validateToken = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`, {
      headers: {
        Authorization: `${req.headers["authorization"]}`,
        fromgateway : true
      }
    })
 
    const cache = await client.get(req.url)
    console.log(cache)
    if(cache) return res.status(200).json(JSON.parse(cache))

    let serviceUrl = `${process.env.USER_SERVICE_URL}/api/v1/user${req.url}`
    req.isAuthenticate = true
    const response = await axios.get(serviceUrl, {headers: {
      'fromgateway' : true
    }})

    await client.set(req.url, JSON.stringify(response.data))
    await client.expire(req.url, process.env.KEY_EXPIRED_IN_SECOND) 
    return res.status(response.status).json(response.data)
   
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

router.get("/identityNumber/:id", async (req, res) => {
  try {
      const validateToken = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`, {
        headers: {
          Authorization: `${req.headers["authorization"]}`,
          fromgateway : true
        }
      })
      
      const cache = await client.get(req.url)

      if(cache) return res.status(200).json(JSON.parse(cache))

      let serviceUrl = `${process.env.USER_SERVICE_URL}/api/v1/user/identityNumber/${req.params.id}`
      req.isAuthenticate = true
      const response = await axios.get(serviceUrl, {headers: {
        'fromgateway' : true
      }})
  
      await client.set(req.url, JSON.stringify(response.data))
      await client.expire(req.url, process.env.KEY_EXPIRED_IN_SECOND) 

      return res.status(response.status).json(response.data)

  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

router.get("/accountNumber/:id", async (req, res) => {
  try {
      const validateToken = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`, {
        headers: {
          Authorization: `${req.headers["authorization"]}`,
          fromgateway : true
        }
      })

    const cache = await client.get(req.url)

    if(cache) return res.status(200).json(JSON.parse(cache))

    let serviceUrl = `${process.env.USER_SERVICE_URL}/api/v1/user/identityNumber/${req.params.id}`
    req.isAuthenticate = true
    const response = await axios.get(serviceUrl, {headers: {
      'fromgateway' : true
    }})

    return res.status(response.status).json(response.data)
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

router.post("/", async (req, res) => {
  try {

    const validateToken = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`, {
      headers: {
        Authorization: `${req.headers["authorization"]}`,
        fromgateway : true
      }
    })

    let serviceUrl = `${process.env.USER_SERVICE_URL}/api/v1/user/`
    
    req.isAuthenticate = true
    const response = await axios.post(serviceUrl, req.body, {headers: {
      'fromgateway' : true
    }})

    return res.status(response.status).json(response.data)
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

router.put("/:id", async (req, res) => {
  try {

    const validateToken = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`, {
      headers: {
        Authorization: `${req.headers["authorization"]}`,
        fromgateway : true
      }
    })
    
    let serviceUrl = `${process.env.USER_SERVICE_URL}/api/v1/user/${req.params.id}`
    
    req.isAuthenticate = true
    const response = await axios.put(serviceUrl, req.body, {headers: {
      'fromgateway' : true
    }})

    return res.status(response.status).json(response.data)
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

router.delete("/:id", async (req, res) => {
  try {

    const validateToken = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`, {
      headers: {
        Authorization: `${req.headers["authorization"]}`,
        fromgateway : true
      }
    })
    
    let serviceUrl = `${process.env.USER_SERVICE_URL}/api/v1/user/${req.params.id}`
    
    req.isAuthenticate = true
    const response = await axios.delete(serviceUrl, {headers: {
      'fromgateway' : true
    }})

    return res.status(response.status).json(response.data)
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

module.exports = router