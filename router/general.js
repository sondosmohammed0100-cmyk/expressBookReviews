const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js'); 

const public_users = express.Router();

// =====================
// Register User
// =====================


const { users } = require('./auth_users.js');

// Register
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ 
    message: "User successfully registered. Now you can login" 
  });
});
// =====================
// Task 10 - Method 1: Get ALL books using Async/Await
// =====================
public_users.get('/', async function (req, res) {
  try {
    // Simulate async operation with Promise
    const getAllBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject(new Error("Books not found"));
        }
      });
    };

    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// =====================
// Task 10 - Method 2: Get book by ISBN using Promise
// =====================
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  })
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
});

// =====================
// Task 10 - Method 3: Get books by Author using Async/Await
// =====================
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        const filteredBooks = Object.entries(books).filter(
          ([key, book]) => book.author.toLowerCase() === author.toLowerCase()
        );

        if (filteredBooks.length > 0) {
          resolve(Object.fromEntries(filteredBooks));
        } else {
          reject(new Error("No books found for this author"));
        }
      });
    };

    const result = await getBooksByAuthor();
    return res.status(200).json(result);

  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// =====================
// Task 10 - Method 4: Get books by Title using Async/Await
// =====================
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        const filteredBooks = Object.entries(books).filter(
          ([key, book]) => book.title.toLowerCase() === title.toLowerCase()
        );

        if (filteredBooks.length > 0) {
          resolve(Object.fromEntries(filteredBooks));
        } else {
          reject(new Error("No books found for this title"));
        }
      });
    };

    const result = await getBooksByTitle();
    return res.status(200).json(result);

  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// =====================
// Get reviews by ISBN
// =====================
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book.reviews || {});
});

module.exports.general = public_users;
module.exports.users = users;