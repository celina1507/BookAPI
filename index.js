//
require("dotenv").config();

//framework
const express = require("express");
const mongoose = require("mongoose");

//models 
const BookModels = require("./database/book");
const AuthorModels = require("./database/author");
const PublicationModels = require("./database/publication");

//database
const database = require("./database/index");

//initialize express
const bookAPI = express();

//configurations
bookAPI.use(express.json());

//establish database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connection Established"));

/* 
Route           /
Description     to get all books
Access          public
Parameters      none
Method          get
*/
bookAPI.get("/", (req, res) => {
  return res.json({ books: database.books });
});

/* 
Route           /is
Description     to get specific book based on isbn
Access          public
Parameters      isbn
Method          get
*/
bookAPI.get("/is/:ISBN", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.ISBN
  );
  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for ISBN of ${req.params.ISBN}`,
    });
  }
  return res.json({ book: getSpecificBook[0] });
});

/* 
Route           /c
Description     to get a list of books based on category
Access          public
Parameters      category
Method          get
*/

bookAPI.get("/c/:category", (req, res) => {
  const getSpecificBooks = database.books.filter((book) =>
    book.category.includes(req.params.category)
  );
  if (getSpecificBooks.length === 0) {
    return res.json({
      error: `No book found for category of ${req.params.c}`,
    });
  }
  return res.json({ books: getSpecificBooks });
});

/*
Route           /a
Description     to get a list of books based on author id
Access          public
Parameters      authorId
Method          get
*/
bookAPI.get("/a/:id", (req, res) => {
  const getSpecificBooks = database.books.filter((book) =>
    book.authors.includes(parseInt(req.params.id))
  );
  if (getSpecificBooks.length === 0) {
    return res.json({
      error: `No book found for author id of ${req.params.id}`,
    });
  }
  return res.json({ book: getSpecificBooks });
});

/* 
Route           /authors
Description     to get all the authors
Access          public
Parameters      none
Method          get
*/

bookAPI.get("/authors", (req, res) => {
  return res.json({ authors: database.authors });
});

/*
Route           /authors
Description     to get specific author
Access          public
Parameters      author
Method          get
*/
bookAPI.get("/authors/:author", (req, res) => {
  const getSpecificAuthor = database.authors.filter(
    (author) => author.id === parseInt(req.params.author)
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No author found for id ${req.params.author}`,
    });
  }
  return res.json({ author: getSpecificAuthor[0] });
});

/*
Route           /au
Description     to get a list of authors based on a book's isbn
Access          public
Parameters      isbn
Method          get
*/
bookAPI.get("/au/:isbn", (req, res) => {
  const getSpecificAuthors = database.authors.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthors.length === 0) {
    return res.json({
      error: `No author found for the book ${req.params.isbn}`,
    });
  }
  return res.json({ authors: getSpecificAuthors });
});

/*
Route           /book/new
Description     to add new book
Access          public
Parameters      NON
Method          POST
*/
bookAPI.post("/book/new", (req, res) => {
  const { newBook } = req.body;
  database.books.push(newBook);
  return res.json({ books: database.books, message: "books was added" });
});
/* 
Route           /author/new
Description     to add new author
Access          public
Parameters      none
Method          POST
*/
bookAPI.post("/author/new", (req, res) => {
  const { newAuthor } = req.body;
  database.authors.push(newAuthor);
  return res.json({ authors: database.authors, message: "author was added!!" });
});

/* 
Route           /book/update
Description     to update title of a book
Access          public
Parameters      isbn
Method          PUT
*/
bookAPI.put("/book/update/:isbn", (req, res) => {
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.bookTitle;
      return;
    }
  });
  return res.json({ books: database.books });
});
/*
Route           /author/update
Description     to update author name
Access          public
Parameters      id
Method          PUT
*/
bookAPI.put("/book/author/update/:isbn", (req, res) => {
  // update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      return book.authors.push(req.body.newAuthor);
    }
  });
  //update author database
  database.authors.forEach((author) => {
    if (author.id === req.body.newAuthor) {
      return author.books.push(req.params.isbn);
    }
  });

  return res.json({ books: database.books, authors: database.authors });
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

/*
Route           /book/delete/author
Description     to delete author from a book
Access          public
Parameters      isbn, authid
Method          DELETE
*/
bookAPI.delete("/book/delete/author/:isbn/:authId", (req, res) => {
  //update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthors = book.authors.filter(
        (author) => author !== parseInt(req.params.authId)
      );
      book.authors = newAuthors;
      return; // no need to check for other functions
    }
  });
  //update author database
  database.authors.forEach((author) => {
    const newBooks = author.books.filter((book) => book !== req.params.isbn);
    author.books = newBooks;
  });
  return res.json({ books: database.books, authors: database.authors });
});

/*
Route           /publication/delete/book
Description     to delete book from a publication
Access          public
Parameters      isbn, pubId
Method          DELETE
*/

bookAPI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
  //update publication database
  database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubId)) {
      const newPubBooks = publication.books.filter(
        (book) => book !== req.params.isbn
      );
      publication.books = newPubBooks;
      return;
    }
  });

  //update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = 0;
      return;
    }
  });
  return res.json({
    books: database.books,
    publications: database.publications,
  });
});

bookAPI.listen(3000, console.log("server running!!"));
