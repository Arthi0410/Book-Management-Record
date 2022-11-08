const express = require("express");
const { getallbooks, getsinglebookbyid, getallissuedbooks, createnewbook } = require("../controllers/book-contoller");
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

router.get("/", getallbooks);

/**
 * Route: /books/:id
 * Method: GET
 * Description: Getting book by id
 * Access: Public
 * Parameters:id
 */

router.get("/:id", getsinglebookbyid);

/**
 * Route: /books
 * Method: POST
 * Description: Creating book
 * Access: Public
 * Parameters:none
 */

router.post("/", createnewbook);

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

router.get("/issued/by-user", getallissuedbooks);

/**
 * Route: /books/fine/books
 * Method: GET
 * Description: Getting all issued books with fine
 * Access: Public
 * Parameters:none
 */

router.get("/fine/books", (req, res) => {
    const userswithissuedbooks = users.filter((each) => {
        if (each.issuedBook) return each;
    });

    const issuedbooksfine = [];

    userswithissuedbooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook)

        book.returndate = each.returnDate;
        book.subscriptiondate = each.subscriptionDate;

        issuedbooksfine.push(book);
    });

    const getDateinDays = (data = "") => {
        let date;
        if (data === "") {
            date = new Date();
        } else {
            date = new Date(data);
        }
        let days = Math.floor(date / (1000 * 60 * 60 * 24));
        return days;
    };


    const subscriptionType = (date) => {
        if (users.subscriptionType === "Basic") {
            date = date + 90;
        } else if (users.subscriptionType === "Standard") {
            date = date + 180;
        } else if (users.subscriptionType === "Premium") {
            date = date + 365;
        }
        return date;
    };

    const returndate = getDateinDays(issuedbooksfine.returnDate);
    const currentDate = getDateinDays();

    console.log(returndate);
    console.log(currentDate);

    const data = [];
    if (returndate < currentDate) {
        data.push(issuedbooksfine);
    };

    if (data.length === 0) {
        res.status(404).json({
            success: false,
            message: "No issued books with fine"
        })
    }

    res.status(200).json({
        success: true,
        data: data
    });
});

module.exports = router;