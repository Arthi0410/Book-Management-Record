const IssuedBook = require("../dtos/book-dto");
const { bookmodel, usermodel } = require("../models");

exports.getallbooks = async (req, res) => {
    const book = await bookmodel.find();

    if (book.length === 0) {
        return res.status(404).json({
            success: true,
            message: "Book not found"
        });
    };

    res.status(200).json({
        success: true,
        data: book,
    });
};

exports.getsinglebookbyid = async (req, res) => {
    const { id } = req.params;
    const book = await bookmodel.findById(id);
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
};

exports.getallissuedbooks = async (req, res) => {
    const user = await usermodel.find({
        issuedBook: { $exists: true },
    }).populate("issuedBook");

    const issuedBooks = user.map((each) => new issuedBook(each))

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
};

exports.createnewbook = async (req, res) => {
    const { name, author, genre, price, publisher } = req.body;
    const book = await bookmodel.create({
        name,
        author,
        genre,
        price,
        publisher
    })

    res.status(200).json({
        success: true,
        data: book,
    });
}

exports.updatebook = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const updatedbook = await bookmodel.findOneAndUpdate({ _id: id }, data, {
        new: true
    });
    // if (!book) {
    //     res.status(404).json({
    //         success: false,
    //         message: "Book doesnt exist"
    //     })
    // }

    res.status(200).json({
        success: true,
        data: updatedbook,
    });
};