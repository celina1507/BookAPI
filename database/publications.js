const mongoose = require("mongoose");

const PublicationsSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

const PublicationModel = moongoose.model("publications", PublicationsSchema);

module.exposts = PublicationModel;