// prefix: /author
// initializing router from express
const Router = require("express").Router();

const AuthorModel = require("../../database/authors");

/*
Route           /authors
Description     to get all the authors
Access          public
Parameters      none
Method          get
*/

Router.get("/", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});

/*
  Route           /a
  Description     to get a list of books based on author id
  Access          public
  Parameters      authorId
  Method          get
  */
Router.get("/a/:id", async (req, res) => {
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
Description     to get specific author
Access          public
Parameters      author
Method          get
*/
Router.get("/:author", async (req, res) => {
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
Router.get("/au/:isbn", async (req, res) => {
  const getSpecificAuthors = await AuthorModel.find({ books: req.params.isbn });

  if (!getSpecificAuthors) {
    return res.json({
      error: `No author found for the book ${req.params.isbn}`,
    });
  }
  return res.json(getSpecificAuthors);
});

/*
  Route           /author/new
  Description     to add new author
  Access          public
  Parameters      none
  Method          POST
  */
Router.post("/new", async (req, res) => {
  const { newAuthor } = req.body;
  AuthorModel.create(newAuthor);
  return res.json({ message: "author was added!!" });
});

module.exports = Router;
