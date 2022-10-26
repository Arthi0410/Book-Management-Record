const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

const router = express.Router();

/**
 * Route: /books
 * Method: GET
 * Description: Getting list of all books
 * Access: Public
 * Parameters:none
 */

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: books,
    });
});

/**
 * Route: /books/:id
 * Method: GET
 * Description: Getting book by id
 * Access: Public
 * Parameters:id
 */

router.get("/:id", (req, res) => {
    const { id } = req.params;
    const book = books.find((each) => each.id === id);
    if (!book) {
        res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }
    res.status(200).json({
        success: true,
        data: book,
    });
});

/**
 * Route: /books
 * Method: POST
 * Description: Creating book
 * Access: Public
 * Parameters:none
 */

router.post("/", (req, res) => {
    const { id, name, author, genre, price, publisher } = req.body;
    const book = books.find((each) => each.id === id);
    if (book) {
        res.status(404).json({
            success: false,
            message: "Book with id already exists"
        });
    }
    books.push({
        id,
        name,
        author,
        genre,
        price,
        publisher
    });
    res.status(200).json({
        success: true,
        data: books,
    });
});

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Updating book by id
 * Access: Public
 * Parameters:id
 */

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const book = books.find((each) => each.id === id);
    if (!book) {
        res.status(404).json({
            success: false,
            message: "Book doesnt exist"
        })
    }
    const updatedbook = books.map((each) => {
        if (each.id === id) {
            return {
                ...each,
                ...data
            }
        }
        return each;
    });
    res.status(200).json({
        success: true,
        data: updatedbook,
    });
});

/**
 * Route: /books/issued/books
 * Method: GET
 * Description: Getting all issued books
 * Access: Public
 * Parameters:Issuedbooks
 */

router.get("/issued/by-user", (req, res) => {
    const userswithissuedbooks = users.filter((each) => {
        if (each.issuedBook) return each;
    });

    const issuedBooks = [];
    userswithissuedbooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook)

        book.issuedby = each.name;
        book.issueddate = each.issuedDate;
        book.returndate = each.returnDate;

        issuedBooks.push(book);
    });
    if (issuedBooks.length === 0) {
        res.status(404).json({
            success: false,
            message: "No issued books"
        });
    }
    res.status(200).json({
        success: true,
        data: issuedBooks
    });
});

module.exports = router;