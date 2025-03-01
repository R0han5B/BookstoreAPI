const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// book data
let books = [
  { isbn: "9781491952023", title: "JavaScript: The Definitive Guide", author: "David Flanagan", reviews: ["Excellent reference book"] },
  { isbn: "9781491924464", title: "You Don't Know JS: Up & Going", author: "Kyle Simpson", reviews: ["Great for deep understanding"] },
  { isbn: "9781593279509", title: "Eloquent JavaScript", author: "Marijn Haverbeke", reviews: ["Well-written and beginner-friendly"] },
  { isbn: "9780596517748", title: "JavaScript: The Good Parts", author: "Douglas Crockford", reviews: ["A classic must-read"] },
  { isbn: "9781933988696", title: "Secrets of the JavaScript Ninja", author: "John Resig", reviews: ["Great for advanced users"] },
  { isbn: "9781449340131", title: "Head First JavaScript Programming", author: "Eric Freeman", reviews: ["Fun and engaging"] },
  { isbn: "9781449331818", title: "Learning JavaScript Design Patterns", author: "Addy Osmani", reviews: ["Great for structuring code"] },
  { isbn: "9780321812186", title: "Effective JavaScript", author: "David Herman", reviews: ["Very insightful"] },
  { isbn: "9781491950296", title: "Programming JavaScript Applications", author: "Eric Elliott", reviews: ["Practical and useful"] },
  { isbn: "9781497408180", title: "A Smarter Way to Learn JavaScript", author: "Mark Myers", reviews: ["Best for beginners"] }
];

let users = [];
const SECRET_KEY = "mysecretkey";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token required" });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Task 1: Get all books
app.get("/books", async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    res.json(allBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 2: Get books by ISBN
app.get("/books/isbn/:isbn", async (req, res) => {
  try {
    const book = await getBookByISBN(req.params.isbn);
    res.json(book);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Task 3: Get books by Author
app.get("/books/author/:author", async (req, res) => {
  try {
    const booksByAuthor = await getBooksByAuthor(req.params.author);
    booksByAuthor.length
      ? res.json(booksByAuthor)
      : res.status(404).json({ message: "No books found" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 4: Get books by Title
app.get("/books/title/:title", async (req, res) => {
  try {
    const booksByTitle = await getBooksByTitle(req.params.title);
    booksByTitle.length
      ? res.json(booksByTitle)
      : res.status(404).json({ message: "No books found" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Task 5: Get book reviews
app.get("/books/isbn/:isbn/reviews", (req, res) => {
  const book = books.find((b) => b.isbn === req.params.isbn);
  book
    ? res.json(book.reviews)
    : res.status(404).json({ message: "Book not found" });
});

// Task 6: Register New User
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, password });
  res.json({ message: "User registered successfully" });
});

// Task 7: Login as Registered User
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Task 8: Add/Modify Book Review (Only Authenticated Users)
app.post("/books/isbn/:isbn/review", verifyToken, (req, res) => {
  const book = books.find((b) => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });

  const existingReviewIndex = book.reviews.findIndex(
    (r) => r.username === req.user.username
  );

  if (existingReviewIndex !== -1) {
    book.reviews[existingReviewIndex].review = req.body.review;
  } else {
    book.reviews.push({ username: req.user.username, review: req.body.review });
  }

  res.json({ message: "Review added/updated" });
});

// Task 9: Delete Book Review (Only Authenticated Users)
app.delete("/books/isbn/:isbn/review", verifyToken, (req, res) => {
  const book = books.find((b) => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });

  book.reviews = book.reviews.filter((r) => r.username !== req.user.username);
  res.json({ message: "Review deleted" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
