const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Sample book data
let books = [
  { isbn: "12345", title: "Node.js Guide", author: "John Doe", reviews: [] },
  { isbn: "67890", title: "JavaScript Basics", author: "Jane Smith", reviews: [] }
];

let users = [];
const SECRET_KEY = "mysecretkey";

// Task 1: Get all books
app.get("/books", (req, res) => {
  res.json(books);
});

// Task 2: Get books by ISBN
app.get("/books/isbn/:isbn", (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  book ? res.json(book) : res.status(404).json({ message: "Book not found" });
});

// Task 3: Get books by Author
app.get("/books/author/:author", (req, res) => {
  const filteredBooks = books.filter(b => b.author === req.params.author);
  filteredBooks.length ? res.json(filteredBooks) : res.status(404).json({ message: "No books found" });
});

// Task 4: Get books by Title
app.get("/books/title/:title", (req, res) => {
  const filteredBooks = books.filter(b => b.title === req.params.title);
  filteredBooks.length ? res.json(filteredBooks) : res.status(404).json({ message: "No books found" });
});

// Task 5: Get book reviews
app.get("/books/isbn/:isbn/reviews", (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  book ? res.json(book.reviews) : res.status(404).json({ message: "Book not found" });
});

// Task 6: Register New User
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, password });
  res.json({ message: "User registered successfully" });
});

// Task 7: Login as Registered User
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token required" });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Task 8: Add/Modify Book Review (Only Authenticated Users)
app.post("/books/isbn/:isbn/review", verifyToken, (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });
  book.reviews.push({ username: req.user.username, review: req.body.review });
  res.json({ message: "Review added/updated" });
});

// Task 9: Delete Book Review (Only Authenticated Users)
app.delete("/books/isbn/:isbn/review", verifyToken, (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });
  book.reviews = book.reviews.filter(r => r.username !== req.user.username);
  res.json({ message: "Review deleted" });
});

// Task 10: Get all books using async callback function
const getAllBooks = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 1000);
  });
};

// Task 11: Search by ISBN using Promises
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books.find(b => b.isbn === isbn);
    book ? resolve(book) : reject("Book not found");
  });
};

// Task 12: Search by Author using Async/Await
const getBooksByAuthor = async (author) => {
  return books.filter(b => b.author === author);
};

// Task 13: Search by Title using Async/Await
const getBooksByTitle = async (title) => {
  return books.filter(b => b.title === title);
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
