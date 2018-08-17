const envConfig = require('nconf');

const NODE_ENV = envConfig.get("NODE_ENV") || 'development';

module.exports = {
 get TEST(){
   return {}
 }
};