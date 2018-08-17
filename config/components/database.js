const MONGO = require('nconf').get('MONGO');

// const joi = require('joi');


// const envVarsSchema = joi.object({
//     DB: joi.string().valid([]).required(),
//     DB_URI: joi.string().required(),
//   }).unknown()
//   .required();

// const { error, value: envVars } = joi.validate(process.env, envVarsSchema);
// if (error) {
//   throw new Error(`Config validation error: ${error.message}`);
// }

const config = {
  db: MONGO.database,
  dbURI: MONGO.url,
  connectionString: MONGO.url
};

module.exports = config;