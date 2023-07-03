//framework
const express = require("express");

//database
const database = require("./database/index");

//initialize express
const bookAPI = express();

//configurations
bookAPI.use(express.json());

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

bookAPI.listen(3000, console.log("server running!!"));
