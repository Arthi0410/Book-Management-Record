const express = require("express");
const dotenv = require("dotenv");
const Dbconnection = require("./databaseconnection");

const app = express();


const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");

dotenv.config();

Dbconnection();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up and running"
    });
});

app.use("/users", usersRouter);
app.use("/books", booksRouter);










app.all("*", (req, res) => {
    res.status(404).json({
        message: "This route does not exist"
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});

