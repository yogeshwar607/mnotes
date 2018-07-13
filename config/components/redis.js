const config = require('nconf');
const redis =  config.get("redis");

function config() {
    return {
      dbURI: redis.host,
      port: redis.port,
      password: '',
    };
  }
  



  module.exports = config();