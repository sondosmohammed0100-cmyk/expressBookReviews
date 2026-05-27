
const express = require('express');
const axios = require('axios');

const public_users = express.Router();

// =====================
// Register User
// =====================
let users = [];

public_users.post("/register", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Missing data"
    });
  }

  const existingUser = users.find(
    (user) => user.username === username
  );

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.json({
    message: `The user ${username} has been added`
  });

});

// =====================
// Get all books
// =====================
public_users.get('/', async function (req, res) {

  try {

    const response = await axios.get(
      "http://localhost:5000/books"
    );

    return res.status(200).json(response.data);

  } catch (error) {

    return res.status(500).json({
      message: "Error fetching books"
    });

  }

});

// =====================
// Get book by ISBN
// =====================
public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  try {

    const response = await axios.get(
      "http://localhost:5000/books"
    );

    const books = response.data;

    if (!books[isbn]) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.status(200).json(books[isbn]);

  } catch (error) {

    return res.status(500).json({
      message: "Error fetching book"
    });

  }

});

// =====================
// Get books by Author
// =====================
public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  try {

    const response = await axios.get(
      "http://localhost:5000/books"
    );

    const books = response.data;

    const filteredBooks = Object.values(books).filter(
      (book) => book.author === author
    );

    if (filteredBooks.length === 0) {

      return res.status(404).json({
        message: "No books found for this author"
      });

    }

    return res.status(200).json(filteredBooks);

  } catch (error) {

    return res.status(500).json({
      message: "Error retrieving books"
    });

  }

});

// =====================
// Get books by Title
// =====================
public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  try {

    const response = await axios.get(
      "http://localhost:5000/books"
    );

    const books = response.data;

    const filteredBooks = Object.values(books).filter(
      (book) => book.title === title
    );

    if (filteredBooks.length === 0) {

      return res.status(404).json({
        message: "No books found for this title"
      });

    }

    return res.status(200).json(filteredBooks);

  } catch (error) {

    return res.status(500).json({
      message: "Error retrieving books"
    });

  }

});

// =====================
// Get reviews by ISBN
// =====================
public_users.get('/review/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  try {

    const response = await axios.get(
      "http://localhost:5000/books"
    );

    const books = response.data;

    if (!books[isbn]) {

      return res.status(404).json({
        message: "Book not found"
      });

    }

    return res.status(200).json(
      books[isbn].reviews || {}
    );

  } catch (error) {

    return res.status(500).json({
      message: "Error fetching reviews"
    });

  }

});

// =====================
module.exports.general = public_users;
