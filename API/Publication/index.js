// prefix: /publication

const Router = require("express").Router();

const PublicationModel = require("../../database/publications");

/*
Route           /publications
Description     to get all the publications
Access          public
Parameters      none
Method          get
*/

Router.get("/", async (req, res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json(getAllPublications);
});

/*
  Route           /publication/new
  Description     to add new publication
  Access          public
  Parameters      none
  Method          POST
  */
Router.post("/new", async (req, res) => {
  const { newPublication } = req.body;
  PublicationModel.create(newPublication);
  return res.json({ message: "publication was added!!" });
});

/*
  Route           /publication/delete/book
  Description     to delete book from a publication
  Access          public
  Parameters      isbn, pubId
  Method          DELETE
  */

Router.delete("/delete/book/:isbn/:pubId", (req, res) => {
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

module.exports = Router;
