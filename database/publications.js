const mongoose = require("mongoose");

const PublicationSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  books: {
    type: [String],
    required: true,
  },
});

const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;
