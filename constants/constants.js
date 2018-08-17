const envConfig = require('nconf');

const NODE_ENV = envConfig.get("NODE_ENV") || 'development';

module.exports = {
  get ROUTING_CODE_TYPE(){ 
    return [
    
  ]
},
  get COUNTRIES (){
   return [];
  },
  get TRULIOO_URL() {
    if (NODE_ENV === 'production') {
      return '';
    }
    return '';
  },
  get MARGIN() {
    return '';
  },
  get FRONT_END_HOST() {
    if (NODE_ENV === 'development') {
      return 'http://localhost:4701';
    } else if (NODE_ENV === 'test') {
      return 'http://161.202.19.190:4701';
    } else if (NODE_ENV === 'production') {
      return '';
    }
  },
  get PASSWORD_REGEX() {
    if (NODE_ENV === 'production') {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,32}$/;
    } else {
      return /[\s\S]*/;
    }
  },
  
  get REUTERS_TOKEN_URL() {
    if (NODE_ENV === 'production') {
      return 'sksss';
    }
    return 'ccc';
  },
  get REUTERS_RATE_URL() {
    if (NODE_ENV === 'production') {
      return 'dd';
    }
    return 'dd';
  },
  get REUTERS_RATE_FIELDS() {
    return 'dd';
  },
  get MARGIN() {
    return 11;
  },
  
  get CURRENCY_PAIR() {
    return {}
  }
};