// Import required modules
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const books = [
    { isbn: '9780135957059', title: 'The Pragmatic Programmer', author: 'David Thomas, Andrew Hunt', reviews: [] },
    { isbn: '9780132350884', title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', reviews: [] },
    { isbn: '9780137081073', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', reviews: [] }
];

// Task 1: Get the book list available in the shop
app.get('/books', (req, res) => {
    res.json(books);
});

// Task 2: Get books based on ISBN
app.get('/books/isbn/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    book ? res.json(book) : res.status(404).json({ error: 'Book not found' });
});

// Task 3: Get all books by Author
app.get('/books/author/:author', (req, res) => {
    const filteredBooks = books.filter(b => b.author === req.params.author);
    res.json(filteredBooks);
});

// Task 4: Get all books based on Title
app.get('/books/title/:title', (req, res) => {
    const filteredBooks = books.filter(b => b.title.includes(req.params.title));
    res.json(filteredBooks);
});

// Task 5: Get book review
app.get('/books/review/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    book ? res.json(book.reviews) : res.status(404).json({ error: 'Book not found' });
});

// Task 6: Register a new user (Mock implementation)
let users = [];
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    res.json({ message: 'User registered successfully' });
});

// Task 7: Login as a registered user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    user ? res.json({ message: 'Login successful' }) : res.status(401).json({ error: 'Invalid credentials' });
});

// Task 8: Add/Modify a book review
app.post('/books/review/:isbn', (req, res) => {
    const { username, review } = req.body;
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) {
        book.reviews.push({ username, review });
        res.json({ message: 'Review added/updated successfully' });
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Task 9: Delete book review added by that particular user
app.delete('/books/review/:isbn', (req, res) => {
    const { username } = req.body;
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) {
        book.reviews = book.reviews.filter(r => r.username !== username);
        res.json({ message: 'Review deleted successfully' });
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Task 10: Get all books using async callback function
const getAllBooks = async (callback) => {
    callback(books);
};

// Task 11: Search by ISBN using Promises
const searchByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        const book = books.find(b => b.isbn === isbn);
        book ? resolve(book) : reject('Book not found');
    });
};

// Task 12: Search by Author
const searchByAuthor = async (author) => {
    return books.filter(b => b.author === author);
};

// Task 13: Search by Title
const searchByTitle = async (title) => {
    return books.filter(b => b.title.includes(title));
};

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});