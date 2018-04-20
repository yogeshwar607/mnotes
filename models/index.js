const mongoose = require('mongoose');

// Setting default SYSTEM PROMISE
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// loading all the models

const User = mongoose.model('user', require('./user.schema')(Schema));
const Payee = mongoose.model('payee', require('./payee.schema')(Schema));

// registring models
const model = {
    User,
    Payee
};

module.exports = model;