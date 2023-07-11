// prefix:  /book
// initializing router from express
const Router = require("express").Router();

//database models
const BookModel = require("../../database/books");
const AuthorModel = require("../../database/authors");

/* 
Route           /
Description     to get all books
Access          public
Parameters      none
Method          get
*/
Router.get("/", async (req, res) => {
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
Router.get("/is/:ISBN", async (req, res) => {
  try {
    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.ISBN });
    // NULL if no match is found
    if (!getSpecificBook) {
      return res.json({
        error: `No book found for ISBN of ${req.params.ISBN}`,
      });
    }
  } catch (error) {
    return res.json({ error: error.message });
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

Router.get("/c/:category", async (req, res) => {
  const getSpecificBooks = await BookModel.find({
    category: req.params.category,
  });
  //if getspecificbooks is null !getspecificbooks will turn to true
  // and the condition given within the block will be run
  if (!getSpecificBooks) {
    return res.json({
      error: `No book found for category of ${req.params.c}`,
    });
  }
  return res.json(getSpecificBooks);
});

/*
Route           /book/new
Description     to add new book
Access          public
Parameters      NON
Method          POST
*/
Router.post("/new", async (req, res) => {
  try {
    const { newBook } = req.body;
    BookModel.create(newBook);
    return res.json({ message: "book was added" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /book/update
Description     to update title of a book
Access          public
Parameters      isbn
Method          PUT
*/
Router.put("/update/:isbn", async (req, res) => {
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
Router.put("/author/update/:isbn", async (req, res) => {
  // update book database
  const updatedBook = await BookModel.findOneAndUpdate(
    { ISBN: req.params.isbn },
    { $addToSet: { authors: req.body.newAuthor } },
    { new: true }
  );
  //update author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor,
    },
    {
      $addToSet: { books: req.params.isbn },
    },
    {
      new: true,
    }
  );
  return res.json({
    message: `author with author id ${req.body.newAuthor} was updated in book with ISBN of ${req.params.isbn}`,
  });
});

/*
  Route           /book/delete
  Description     to delete a book
  Access          public
  Parameters      isbn
  Method          DELETE
  */

Router.delete("/delete/:isbn", async (req, res) => {
  const updatedBooks = await BookModel.findOneAndDelete(
    {
      ISBN: req.params.isbn,
    },
    { new: true }
  );
  return res.json({ deletedBook: updatedBooks });
});

/*
  Route           /book/delete/author
  Description     to delete author from a book
  Access          public
  Parameters      isbn, authid
  Method          DELETE
  */
Router.delete("/delete/author/:isbn/:authId", async (req, res) => {
  //update book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $pull: { authors: parseInt(req.params.authId) },
    },
    {
      new: true,
    }
  );
  //update author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.authId),
    },
    {
      $pull: { books: req.params.isbn },
    },
    {
      new: true,
    }
  );
  return res.json({ books: updatedBook, authors: updatedAuthor });
});

module.exports = Router;
