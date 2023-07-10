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

//initialize express
const bookAPI = express();

//configurations
bookAPI.use(express.json());

//connection with mongoose
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connection Establised"));

/* 
Route           /
Description     to get all books
Access          public
Parameters      none
Method          get
*/
bookAPI.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route           /is
Description     to get specific book based on isbn
Access          public
Parameters      isbn
Method          get
*/
bookAPI.get("/is/:ISBN", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.ISBN });

  if (!getSpecificBook) {
    return res.json({
      error: `No book found for ISBN of ${req.params.ISBN}`,
    });
  }
  return res.json(getSpecificBook);
});

/*
Route           /c
Description     to get a list of books based on category
Access          public
Parameters      category
Method          get
*/

bookAPI.get("/c/:category", async (req, res) => {
  const getSpecificBooks = await BookModel.find({
    category: req.params.category,
  });
  if (!getSpecificBooks) {
    return res.json({
      error: `No book found for category of ${req.params.c}`,
    });
  }
  return res.json(getSpecificBooks);
});

/*
Route           /a
Description     to get a list of books based on author id
Access          public
Parameters      authorId
Method          get
*/
bookAPI.get("/a/:id", async (req, res) => {
  const getSpecificBooks = await AuthorModel.findOne({
    id: parseInt(req.params.id),
  });
  if (!getSpecificBooks) {
    return res.json({
      error: `No book found for author id of ${req.params.id}`,
    });
  }
  return res.json(getSpecificBooks);
});

/*
Route           /authors
Description     to get all the authors
Access          public
Parameters      none
Method          get
*/

bookAPI.get("/authors", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});

/*
Route           /publications
Description     to get all the publications
Access          public
Parameters      none
Method          get
*/

bookAPI.get("/publications", async (req, res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json(getAllPublications);
});

/*
Route           /authors
Description     to get specific author
Access          public
Parameters      author
Method          get
*/
bookAPI.get("/authors/:author", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.findone({
    id: parseInt(req.params.author),
  });

  if (!getSpecificAuthor) {
    return res.json({
      error: `No author found for id ${req.params.author}`,
    });
  }
  return res.json(getSpecificAuthor);
});

/*
Route           /au
Description     to get a list of authors based on a book's isbn
Access          public
Parameters      isbn
Method          get
*/
bookAPI.get("/au/:isbn", async (req, res) => {
  const getSpecificAuthors = await AuthorModel.find({ books: req.params.isbn });

  if (!getSpecificAuthors) {
    return res.json({
      error: `No author found for the book ${req.params.isbn}`,
    });
  }
  return res.json(getSpecificAuthors);
});

/*
Route           /book/new
Description     to add new book
Access          public
Parameters      NON
Method          POST
*/
bookAPI.post("/book/new", async (req, res) => {
  const { newBook } = req.body;
  BookModel.create(newBook);
  return res.json({ message: "book was added" });
});
/*
Route           /author/new
Description     to add new author
Access          public
Parameters      none
Method          POST
*/
bookAPI.post("/author/new", async (req, res) => {
  const { newAuthor } = req.body;
  AuthorModel.create(newAuthor);
  return res.json({ message: "author was added!!" });
});

/*
Route           /publication/new
Description     to add new publication
Access          public
Parameters      none
Method          POST
*/
bookAPI.post("/publication/new", async (req, res) => {
  const { newPublication } = req.body;
  PublicationModel.create(newPublication);
  return res.json({ message: "publication was added!!" });
});

/*
Route           /book/update
Description     to update title of a book
Access          public
Parameters      isbn
Method          PUT
*/
bookAPI.put("/book/update/:isbn", async (req, res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      title: req.body.bookTitle,
    },
    {
      new: true, // to get updated data
    }
  );
  return res.json({ books: updatedBook });
});
/*
Route           /author/update
Description     to add author to a book
Access          public
Parameters      isbn
Method          PUT
*/
bookAPI.put("/book/author/update/:isbn", async (req, res) => {
  // update book database
  const updatedBook = await BookModel.findOneAndUpdate(
    { ISBN: req.params.isbn },
    { $addToSet: { authors: req.body.newAuthor } },
    { new: true},
  );
  //update author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate({
    id: req.body.newAuthor
  },{
    $addToSet: {books: req.params.isbn}
  },{
    new: true
  });
  return res.json({message: `author with author id ${req.body.newAuthor} was updated in book with ISBN of ${req.params.isbn}`});
});

/*
Route           /book/delete
Description     to delete a book
Access          public
Parameters      isbn
Method          DELETE
*/

bookAPI.delete("/book/delete/:isbn", (req, res) => {
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  );
  database.books = updatedBookDatabase;
  database.authors.forEach((author) => {
    const newBooks = author.books.filter((book) => book !== req.params.isbn);
    author.books = newBooks;
  });
  return res.json({ books: database.books, authors: database.authors });
});

// /*
// Route           /book/delete/author
// Description     to delete author from a book
// Access          public
// Parameters      isbn, authid
// Method          DELETE
// */
// bookAPI.delete("/book/delete/author/:isbn/:authId", (req, res) => {
//   //update book database
//   database.books.forEach((book) => {
//     if (book.ISBN === req.params.isbn) {
//       const newAuthors = book.authors.filter(
//         (author) => author !== parseInt(req.params.authId)
//       );
//       book.authors = newAuthors;
//       return; // no need to check for other functions
//     }
//   });
//   //update author database
//   database.authors.forEach((author) => {
//     const newBooks = author.books.filter((book) => book !== req.params.isbn);
//     author.books = newBooks;
//   });
//   return res.json({ books: database.books, authors: database.authors });
// });

// /*
// Route           /publication/delete/book
// Description     to delete book from a publication
// Access          public
// Parameters      isbn, pubId
// Method          DELETE
// */

// bookAPI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
//   //update publication database
//   database.publications.forEach((publication) => {
//     if(publication.id === parseInt(req.params.pubId)){
//       const newPubBooks = publication.books.filter((book) => book !== req.params.isbn)
//       publication.books = newPubBooks;
//       return;
//     }
//   });

//   //update book database
//   database.books.forEach((book) => {
//     if(book.ISBN === req.params.isbn){
//       book.publication = 0;
//       return;
//     }
//   });
//   return res.json({books: database.books, publications: database.publications});
// })

bookAPI.listen(3000, console.log("server running!!"));
