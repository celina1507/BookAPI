const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 8,
    }, //required
    title: {
        type: String,
        required:true,
        minLength: 10,
    },
    authors: {
        type: [Number],
        required:true,
    },
    language: {
        type: String,
        required: true,
    },
    pubDate: {
        type: String,
        required: true,
    },
    numOfPage: {
        type: Number,
        required: true,
    },
    category: {
        type:[String],
        required: true,
    },
    publication: {
        type: Number,
        required: true,
    },
});

const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;