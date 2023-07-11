//import dotenv
require("dotenv").config();

//framework
const express = require("express");
const mongoose = require("mongoose");

//database
const database = require("./database/index");

//models
const BookModel = require("./database/books");
const AuthorModel = require("./database/authors");
const PublicationModel = require("./database/publications");

// microservices routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

//initialize express
const bookAPI = express();

//configurations
bookAPI.use(express.json());

//connection with mongoose
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connection Establised"));

// initializing microservices
// prefix will be attached to the route of books
bookAPI.use("/book", Books);
bookAPI.use("/author", Authors);
bookAPI.use("/publication", Publications);

bookAPI.listen(3000, console.log("server running!!"));