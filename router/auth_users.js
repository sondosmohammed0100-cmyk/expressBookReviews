const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// =====================
// Validate username
// =====================
const isValid = (username) => {
  return username && username.length > 0;
};

// =====================
// Check user credentials
// =====================
const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username && user.password === password
  );
};

// =====================
// JWT Middleware (IMPORTANT FIX)
// =====================
const verifyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "fingerprint_customer");
    req.user = decoded.username;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// =====================
// Login Route
// =====================
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {
    let token = jwt.sign(
      { username },
      "fingerprint_customer",
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token
    });
  }

  return res.status(401).json({ message: "Invalid Login" });
});

// =====================
// Add / Update Review
// =====================
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user;

  books[isbn].reviews[username] = review;

  return res.json({
    message: "Review added/updated",
    reviews: books[isbn].reviews
  });
});

// =====================
// Delete Review
// =====================
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user;

  if (books[isbn]?.reviews?.[username]) {
    delete books[isbn].reviews[username];
    return res.json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews
    });
  }

  return res.status(404).json({ message: "Review not found" });
});

// =====================
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;