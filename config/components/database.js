const config = require('nconf');
const {
  Pool,
  types
} = require('pg');
const Boom = require('boom');
const moment = require('moment');

const {
  getCommaSeparatedColumns,
  getObjectValues,
  getCommaSeparatedParamSubtitute,
  getUpdateSetClause,
} = rootRequire('commons').UTILS;


// Fix for parsing of numeric fields
types.setTypeParser(1700, 'text', parseFloat);
types.setTypeParser(20, (val) => {
  return parseInt(val, 10);
});
// Fix for parsing of date fields
types.setTypeParser(1082, (val) => {
  return val === null ? null : moment(val).format('DD/MM/YYYY');
});
// Fix for parsing of timestamp without timezone fields
types.setTypeParser(1114, (val) => {
  return val;
});
// Fix for parsing of timestamp with timezone fields
types.setTypeParser(1184, (val) => {
  return val;
});

// const pool = new Pool({
//   host: 'localhost',
//   port: 5432,
//   user: 'uueubcejqlrroh',
//   password: '1234',
//   database: "Remittance",
//   ssl: false,
//   max: 20,
  
// })

const db =  config.get("db");
// user : 

const pool = new Pool({
  user: db.user,
  host: db.host,
  database: db.database,
  password: db.password,
  port: db.port,
  max: db.max,
 // idleTimeoutMillis: config.get('PGIDLETIMEOUT'),
 // connectionTimeoutMillis: config.get('CONNECTIONTIMEOUT'),
});

pool.on('error', (err) => {
  logger.error(`Postgres connection error on client - ${err.message}`);
  throw err;
});


module.exports = pool;