// const assert = require('assert');

const MODEL = rootRequire('models').Folders;
const DAO = require('./DAO'); // return constructor function.

function FoldersDAO() {
  this.Model = MODEL;
}

// Prototypal Inheritance
FoldersDAO.prototype = new DAO();

module.exports = function () {
  return new FoldersDAO();
};