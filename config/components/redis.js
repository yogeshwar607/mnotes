function config() {
      return {
        dbURI: '127.0.0.1',
        port: '6379',
        password: '',
      };
  }
  
  const redis = require('redis');
  
  let client = null;
  
  module.exports = function () {
    const redisConfig = config();
      client = redis.createClient(redisConfig.port, redisConfig.dbURI, {
        retry_strategy: function (options) {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
            return new Error('The server refused the connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
          }
          // reconnect after
          return Math.min(options.attempt * 100, 3000);
        },
      });
    
    client.on('connect', () => {
      logger.info('Redis connected.');
    });
    client.on('ready', () => {
      logger.info('Redis connection estsblished.');
    });
    client.on('error', (err) => {
      logger.error(`Redis Error ${err.message}`);
    });
    client.on('reconnecting', () => {
      logger.info('Redis client reconnecting to redis server');
    });
    client.on('end', () => {
      logger.info('Redis disconnected');
    });
    return client;
  };