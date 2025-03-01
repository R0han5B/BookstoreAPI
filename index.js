const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let books = [
  { isbn: "9781491952023", title: "JavaScript: The Definitive Guide", author: "David Flanagan", reviews: ["Excellent reference book!"] },
  { isbn: "9781491924464", title: "You Don't Know JS: Up & Going", author: "Kyle Simpson", reviews: ["Great for deep understanding!"] },
  { isbn: "9781593279509", title: "Eloquent JavaScript", author: "Marijn Haverbeke", reviews: ["Very well written and insightful!"] },
  { isbn: "9780596517748", title: "JavaScript: The Good Parts", author: "Douglas Crockford", reviews: ["A must-read for JavaScript developers!"] },
  { isbn: "9781933988696", title: "Secrets of the JavaScript Ninja", author: "John Resig", reviews: ["Perfect for advanced JavaScript users!"] },
  { isbn: "9781449340131", title: "Head First JavaScript Programming", author: "Eric Freeman", reviews: ["Great for beginners and interactive learning!"] },
  { isbn: "9781449331818", title: "Learning JavaScript Design Patterns", author: "Addy Osmani", reviews: ["Comprehensive and practical!"] },
  { isbn: "9780321812186", title: "Effective JavaScript", author: "David Herman", reviews: ["Packed with useful tips!"] },
  { isbn: "9781491950296", title: "Programming JavaScript Applications", author: "Eric Elliott", reviews: ["Very informative and practical!"] },
  { isbn: "9781497408180", title: "A Smarter Way to Learn JavaScript", author: "Mark Myers", reviews: ["Perfect for self-paced learning!"] }
];

let users = [];
const SECRET_KEY = "mysecretkey";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token required" });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Add/Modify Book Review 
app.post("/books/isbn/:isbn/review", verifyToken, (req, res) => {
  const { review } = req.body;
  const book = books.find((b) => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (!book.reviews) book.reviews = [];

  const userReviews = book.reviews.filter((r) => r.username === req.user.username);
  if (userReviews.length >= 3) {
    return res.status(400).json({ message: "You can only add up to 3 reviews per book." });
  }

  book.reviews.push({ username: req.user.username, review });
  res.json({ message: "Review added." });
});

// Modify a specific review
app.put("/books/isbn/:isbn/review/:index", verifyToken, (req, res) => {
  const { review } = req.body;
  const book = books.find((b) => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });

  const index = parseInt(req.params.index);
  if (isNaN(index) || index < 0 || index >= book.reviews.length) {
    return res.status(400).json({ message: "Invalid review index" });
  }

  if (book.reviews[index].username !== req.user.username) {
    return res.status(403).json({ message: "You can only modify your own reviews." });
  }

  book.reviews[index].review = review;
  res.json({ message: "Review updated." });
});

// Delete a specific review
app.delete("/books/isbn/:isbn/review/:index", verifyToken, (req, res) => {
  const book = books.find((b) => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });

  const index = parseInt(req.params.index);
  if (isNaN(index) || index < 0 || index >= book.reviews.length) {
    return res.status(400).json({ message: "Invalid review index" });
  }

  if (book.reviews[index].username !== req.user.username) {
    return res.status(403).json({ message: "You can only delete your own reviews." });
  }

  book.reviews.splice(index, 1);
  res.json({ message: "Review deleted." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
