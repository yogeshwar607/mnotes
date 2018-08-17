const mongoose = require('mongoose');

// Setting default SYSTEM PROMISE
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// loading all the models

const User = mongoose.model('user', require('./user.schema')(Schema));
const Folders = mongoose.model('folders',require('./folders.schema')(Schema));
const Notes = mongoose.model('notes',require('./notes.schema')(Schema));
const Tags = mongoose.model('tags',require('./tags.schema')(Schema));
// registring models
const model = {
    User,
    Folders,
    Notes,
    Tags
};

module.exports = model;