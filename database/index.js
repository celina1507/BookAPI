const books = [
  {
    ISBN: "12345ONE",
    title: "getting started with mern",
    authors: [1, 2, 3],
    language: "eng",
    pubDate: "2021-08-08",
    numOfPage: 225,
    category: ["fiction", "programming", "web dev", "tech"],
    publication: 1,
  },
];

const authors = [
  {
    id: 1,
    name: "pavan",
    books: ["12345ONE"],
  },
  {
    id: 2,
    name: "deepak",
    books: ["12345ONE"],
  },
  {
    id: 3,
    name: "sushil",
    books: ["12345ONE"],
  },
];

const publications = [
  {
    id: 1,
    name: "chakra",
    books: ["12345ONE"],
  },
];

module.exports = {books, authors, publications};