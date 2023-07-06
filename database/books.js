const mongoose = require("mongoose");

//create Schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String],
    publication: Number,
});

//create a model
const BookModel = mongoose.model(BookSchema);

//export the model
module.exports = BookModel;