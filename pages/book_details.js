const async = require('async');
const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');

// Function to get book details by ID
async function getBook(id) {
    try {
        if (typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Invalid book ID");
        }
        const book = await Book.findOne({ '_id': id }).populate('author');
        return book;
    } catch (error) {
        throw new Error("Error fetching book details");
    }
}

// Function to get book instances details by book ID
async function getBookDetails(id) {
    try {
        if (typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Invalid book ID");
        }
        const bookInstances = await BookInstance.find({ 'book': id }).select('imprint status');
        return bookInstances;
    } catch (error) {
        throw new Error("Error fetching book instances details");
    }
}

// Controller function to show book details
exports.showBookDetails = async (res, id) => {
    try {
        const [book, bookDetails] = await Promise.all([getBook(id), getBookDetails(id)]);
        if (!book) {
            throw new Error(`Book ${id} not found`);
        }
        res.send({
            title: book.title,
            author: book.author.name,
            copies: bookDetails
        });
    } catch (error) {
        res.send(error.message);
    }
}
