require('dotenv').config();

const redis = require('redis')

const client = redis.createClient({
  // url: 'redis://default:redispw@localhost:49154'
  url: 'redis://default:sAwGLZwKScemLT1hryvOcqbmKugvl8m6@redis-14434.c292.ap-southeast-1-1.ec2.cloud.redislabs.com:14434'
});

client.on("ready", () => {
  console.log("ready")
})

module.exports = client