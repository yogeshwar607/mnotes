const Boom = require('boom');
const Joi = require('joi');
const parseUrl = require('parseurl');
const fs = require('fs');
const path = require('path');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('individual_doc_detail');

const {
    QueryBuilder,
    database: pg,
    query: pgQuery,
} = rootRequire('db');

const columns = {
    doc_id: "doc_id",
    cust_id: "cust_id",
    doc_type:"doc_type",
    doc_path:"doc_path",
};

async function logic({
    query,
    params,
    body,
}) {
    try {
        if (!params.id) return Boom.badRequest(`${'document'} id is not present`);
        let docId = params.id
        // find document and read it and send it

       
    } catch (e) {
        throw e;
    }
}

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
  };

function handler(req, res, next) {
    let pathname = req.query && req.query.path ? req.query.path:'';
   
  // parse URL
//   const parsedUrl = url.parse(req.url);
//   // extract URL path
//   let pathname = `.${parsedUrl.pathname}`;
//   // maps file extention to MIME types
  
  fs.exists(pathname, function (exist) {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }
    // if is a directory, then look for index.html
    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
    }
    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext;
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });
}
module.exports = handler;