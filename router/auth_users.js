const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

// مشترك مع general.js
let users = [];

const isValid = (username) => {
  return username && username.length > 0;
};

const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username && user.password === password
  );
};

// Login
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

    // ✅ المهم: حفظ الـ token في الـ session
    req.session.authorization = { token };

    return res.json({
      message: "Login successful",
      token
    });
  }

  return res.status(401).json({ message: "Invalid Login" });
});

// Add / Update Review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  // ✅ اجيب الـ username من الـ session token
  const token = req.session.authorization?.token;
  const decoded = jwt.verify(token, "fingerprint_customer");
  const username = decoded.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});

// Delete Review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const token = req.session.authorization?.token;
  const decoded = jwt.verify(token, "fingerprint_customer");
  const username = decoded.username;

  if (books[isbn]?.reviews?.[username]) {
    delete books[isbn].reviews[username];
    return res.json({
      message: `Review for ISBN ${isbn} deleted`
    });
  }

  return res.status(404).json({ message: "Review not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;