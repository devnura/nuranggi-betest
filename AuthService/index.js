
const express = require('express')
const app = express()
const port = 3001

app.get('/', (req, res) => {
    res.json({message : 'Hello From AUTH SERVICES!'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
