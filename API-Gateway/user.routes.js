const express = require("express");
const router = express.Router();
const axios = require("axios")
const client = require("./redis")

router.get("/", async (req, res) => {
  try {
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.json({
        code: "401",
        message: "Bearer Token is required",
        data: {},
      });
    }

    const validateToken = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`, {
      headers: {
        Authorization: `${req.headers["authorization"]}`,
        fromgateway : true
      }
    })
    
    if(validateToken.status != 200) return res.status(validateToken.status || 400).json(validateToken.data)

    const cache = await client.get("fetch-"+req.url)

    if(cache) return res.status(200).json(JSON.parse(cache))
    let serviceUrl = `${process.env.USER_SERVICE_URL}/api/v1/user${req.url}`
    req.isAuthenticate = true
    const response = await axios.get(serviceUrl, {headers: {
      'fromgateway' : true
    }})

    await client.set("fetch-"+req.url, JSON.stringify(response.data))
    await client.expire("fetch-"+req.url, process.env.KEY_EXPIRED_IN_SECOND) 
    return res.status(response.status).json(response.data)
   
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

router.get("/identityNumber/:id", async (req, res) => {
  try {
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.json({
        code: "401",
        message: "Bearer Token is required",
        data: {},
      });
    }

      const validateToken = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`, {
        headers: {
          Authorization: `${req.headers["authorization"]}`,
          fromgateway : true
        }
      })
      if(validateToken.status != 200) return res.status(validateToken.status || 400).json(validateToken.data)

      const redisKey = `getbyparam-${req.url}`
      const cache = await client.get(redisKey)
      console.log(cache)
      if(cache) return res.status(200).json(JSON.parse(cache))

      let serviceUrl = `${process.env.USER_SERVICE_URL}/api/v1/user/identityNumber/${req.params.id}`
      req.isAuthenticate = true
      const response = await axios.get(serviceUrl, {headers: {
        'fromgateway' : true
      }})
  
      await client.set(redisKey, JSON.stringify(response.data))
      await client.expire(redisKey, process.env.KEY_EXPIRED_IN_SECOND) 

      return res.status(response.status).json(response.data)

  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

router.get("/accountNumber/:id", async (req, res) => {
  try {
      let authHeader = req.headers["authorization"];
      let token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        return res.json({
          code: "401",
          message: "Bearer Token is required",
          data: {},
        });
      }
      const validateToken = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`, {
        headers: {
          Authorization: `${req.headers["authorization"]}`,
          fromgateway : true
        }
      })
      if(validateToken.status != 200) return res.status(validateToken.status || 400).json(validateToken.data)
      const redisKey = `getbyparam-${req.url}`
      const cache = await client.get(redisKey)
      console.log(cache)
      if(cache) return res.status(200).json(JSON.parse(cache))

      let serviceUrl = `${process.env.USER_SERVICE_URL}/api/v1/user/accountNumber/${req.params.id}`
      req.isAuthenticate = true

      const response = await axios.get(serviceUrl, {headers: {
        'fromgateway' : true
      }})

      await client.set(redisKey, JSON.stringify(response.data))
      await client.expire(redisKey, process.env.KEY_EXPIRED_IN_SECOND) 

      return res.status(response.status).json(response.data)
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

router.post("/", async (req, res) => {
  try {
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.json({
        code: "401",
        message: "Bearer Token is required",
        data: {},
      });
    }

    const validateToken = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`, {
      headers: {
        Authorization: `${req.headers["authorization"]}`,
        fromgateway : true
      }
    })
    // '--scan' '--pattern' '10*' '|' 'xargs' 'redis-cli del'
    if(validateToken.status != 200) return res.status(validateToken.status || 400).json(validateToken.data)
    let serviceUrl = `${process.env.USER_SERVICE_URL}/api/v1/user/`
    
    req.isAuthenticate = true
    const response = await axios.post(serviceUrl, req.body, {headers: {
      'fromgateway' : true
    }})
    console.log((response.status == 201), response.status)
    if(response.status == 201) {
      let cursor = '0';
      // delete any paths with query string matches
      const reply = await client.scan(cursor, { MATCH: "fetch-*", COUNT: 1000 });
      console.log("reply : ", reply)
      for (key of reply.keys) {
        cursor = reply.cursor;
        await client.del(key);
      }
    }
    return res.status(response.status).json(response.data)
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

router.put("/:id", async (req, res) => {
  try {
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.json({
        code: "401",
        message: "Bearer Token is required",
        data: {},
      });
    }

    const validateToken = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`, {
      headers: {
        Authorization: `${req.headers["authorization"]}`,
        fromgateway : true
      }
    })
    console.log(1)
    if(validateToken.status != 200) return res.status(validateToken.status || 400).json(validateToken.data)

    let serviceUrl = `${process.env.USER_SERVICE_URL}/api/v1/user/${req.params.id}`
    
    req.isAuthenticate = true
    const response = await axios.put(serviceUrl, req.body, {headers: {
      'fromgateway' : true
    }})

    if(response.status == 200) {
      let cursor = '0';
      // delete any paths with query string matches
      const reply = await client.scan(cursor, { MATCH: "fetch-*", COUNT: 1000 });
      console.log("reply : ", reply)
      for (key of reply.keys) {
        cursor = reply.cursor;
        await client.del(key);
      }

      const getByparam = await client.scan(cursor, { MATCH: `getbyparam-*`, COUNT: 1000 });
      for (key of getByparam.keys) {
        cursor = getByparam.cursor;
        await client.del(key);
      }
    }
    return res.status(response.status).json(response.data)
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

router.delete("/:id", async (req, res) => {
  try {
    console.log("masuk")
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.json({
        code: "401",
        message: "Bearer Token is required",
        data: {},
      });
    }

    const validateToken = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`, {
      headers: {
        Authorization: `${req.headers["authorization"]}`,
        fromgateway : true
      }
    })
    if(validateToken.status != 200) return res.status(validateToken.status || 400).json(validateToken.data)
    let serviceUrl = `${process.env.USER_SERVICE_URL}/api/v1/user/${req.params.id}`
    
    req.isAuthenticate = true
    const response = await axios.delete(serviceUrl, {headers: {
      'fromgateway' : true
    }})
    console.log(response.status)
    if(response.status == 200){
        let cursor = '0';
        const reply = await client.scan(cursor, { MATCH: "fetch-*", COUNT: 1000 });
        console.log("reply : ", reply)
        for (key of reply.keys) {
          cursor = reply.cursor;
          await client.del(key);
        }
  
      const getByparam = await client.scan(cursor, { MATCH: `getbyparam-*`, COUNT: 1000 });
      for (key of getByparam.keys) {
        console.log("reply : ", getByparam)
        cursor = getByparam.cursor;
        await client.del(key);
      }
    }

    return res.status(response.status).json(response.data)
  } catch (error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error.message)
  }
});

module.exports = router