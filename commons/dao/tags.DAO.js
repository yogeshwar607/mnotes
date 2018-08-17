// const assert = require('assert');

const MODEL = rootRequire('models').Tags;
const DAO = require('./DAO'); // return constructor function.

function TagsDAO() {
  this.Model = MODEL;
}

// Prototypal Inheritance
TagsDAO.prototype = new DAO();

module.exports = function () {
  return new TagsDAO();
};