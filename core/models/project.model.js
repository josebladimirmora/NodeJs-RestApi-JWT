'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projecSquema = Schema({
    userId: String,
    name: String,
    description: String,
    category: String,
    year: Number,
    langs: String,
    image: String
});

module.exports = mongoose.model('Project', projecSquema);