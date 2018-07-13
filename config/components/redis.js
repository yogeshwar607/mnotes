
const redis =  require('nconf').get("REDIS");

function config() {
    return {
      dbURI: redis.host,
      port: redis.port,
      password: redis.password,
    };
  }
  
  module.exports = config();