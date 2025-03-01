const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Sample book data
let books = [
  { isbn: "9781491952023", title: "JavaScript: The Definitive Guide", author: "David Flanagan", reviews: [] },
  { isbn: "9781491924464", title: "You Don't Know JS: Up & Going", author: "Kyle Simpson", reviews: [] },
  { isbn: "9781593279509", title: "Eloquent JavaScript", author: "Marijn Haverbeke", reviews: [] },
  { isbn: "9780596517748", title: "JavaScript: The Good Parts", author: "Douglas Crockford", reviews: [] },
  { isbn: "9781933988696", title: "Secrets of the JavaScript Ninja", author: "John Resig", reviews: [] },
  { isbn: "9781449340131", title: "Head First JavaScript Programming", author: "Eric Freeman", reviews: [] },
  { isbn: "9781449331818", title: "Learning JavaScript Design Patterns", author: "Addy Osmani", reviews: [] },
  { isbn: "9780321812186", title: "Effective JavaScript", author: "David Herman", reviews: [] },
  { isbn: "9781491950296", title: "Programming JavaScript Applications", author: "Eric Elliott", reviews: [] },
  { isbn: "9781497408180", title: "A Smarter Way to Learn JavaScript", author: "Mark Myers", reviews: [] }
];

// Async function to get all books
const getAllBooks = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books); // Resolve the promise with the list of books after 1 second
    }, 1000); // Simulate a 1-second delay
  });
};

// Task 1: Get all books
app.get("/books", async (req, res) => {
  try {
    const allBooks = await getAllBooks(); // Wait for the async operation to complete
    res.json(allBooks); // Send the list of books as a JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});