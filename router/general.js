const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing data" });
  }

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.json(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let result = {};

  for (let key in books) {
    if (books[key].author === author) {
      result[key] = books[key];
    }
  }

  return res.json(result);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let result = {};

  for (let key in books) {
    if (books[key].title === title) {
      result[key] = books[key];
    }
  }

  return res.json(result);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.json(books[isbn].reviews);
});

module.exports.general = public_users;
