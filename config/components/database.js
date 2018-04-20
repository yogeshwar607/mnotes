// const joi = require('joi');

// const envVarsSchema = joi.object({
//     DB: joi.string().valid(['masspay-v2-staging']).required(),
//     DB_URI: joi.string().valid(['localhost']).required(),
//   }).unknown()
//   .required();

// const { error, value: envVars } = joi.validate(process.env, envVarsSchema);
// if (error) {
//   throw new Error(`Config validation error: ${error.message}`);
// }

// const config = {
//   db: envVars.DB,
//   dbURI: envVars.DB_URI,
//   connectionString: `mongodb://${envVars.DB_URI}/${envVars.DB}`,
// };
// const { Client } = require('pg')

// // const config = new Client({
// //     host: '183.87.142.250',
// //     port: 5433,
// //     user: 'postgres',
// //     password: 'sa@123',
// //     database: "Remittance"
// // })

// //Heroku Server connectivity
// const config = new Client({
//     host: 'ec2-23-21-201-255.compute-1.amazonaws.com',
//     port: 5432,
//     user: 'uueubcejqlrroh',
//     password: 'efb86792e52a6628d227bcfb5025b504cbbe6f0fd10f542eae26ad3c50ea474f',
//     database: "da9ubjksb8fk80",
//     ssl: true
// })

const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'uueubcejqlrroh',
    password: '1234',
    database: "Remittance",
    ssl: false,
    max: 20
})

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

module.exports = pool;