// const assert = require('assert');

const MODEL = rootRequire('models').Notes;
const DAO = require('./DAO'); // return constructor function.

function NotesDAO() {
  this.Model = MODEL;
}

// Prototypal Inheritance
NotesDAO.prototype = new DAO();

module.exports = function () {
  return new NotesDAO();
};