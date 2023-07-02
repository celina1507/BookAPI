//framework
const express = require("express");

//database
const database = require("./database/index");

//initialize express
const bookAPI = express();

//configurations
bookAPI.use(express.json());

bookAPI.get("/", (req, res) => {
    return response.json({books: database.books});
});



bookAPI.listen(3000, console.log("server running!!"));