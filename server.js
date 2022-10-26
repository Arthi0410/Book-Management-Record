const express = require("express");

const app = express();

const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");

const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up and running"
    });
});

app.use("/users", usersRouter);
app.use("/books", booksRouter);

/**
 * Route: /users
 * Method: GET
 * Description: Get all users
 * Access: Public
 * Parameters:None 
 */
app.get("/users", (req, res) => {
    res.status(200).json({
        success: true,
        data: users,
    });

});

/**
 * Route: /users/:id
 * Method: GET
 * Description: Getting user by id
 * Access: Public
 * Parameters:id
 */

app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    res.status(200).json({
        success: true,
        data: user,
    });
});

/**
 * Route: /users
 * Method: POST
 * Description: Creating a new user
 * Access: Public
 * Parameters:None 
 */

app.post("/users", (req, res) => {

    const { id, name, surname, email, subscriptionType, subscriptionDate } = req.body;
    const user = users.find((each) => (each.id === id))
    if (user) {
        return res.status(404).json({
            success: false,
            message: "User already exists with the id"
        });
    }
    users.push({
        id,
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate,
    });
    res.status(200).json({
        success: true,
        data: users
    });
});

/**
 * Route: /users/:id
 * Method: PUT
 * Description: Updating user by id
 * Access: Public
 * Parameters:id
 */

app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const user = users.find((each) => each.id === id);

    if (!user)
        return res.status(404).json({
            success: false,
            message: "User not found"
        });

    const updatedUser = users.map((each) => {
        if (each.id === id) {
            return {
                ...each,
                ...data,
            };
        }
        return each;
    });

    return res.status(200).json({
        success: true,
        data: updatedUser,
    });
});

/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Deleteing user by id
 * Access: Public
 * Parameters:id
 */

app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    const { issuedBook } = req.body;
    const user = users.find((each) => each.id === id)


    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    const issued = users.find((each) => {
        if (each.issuedBook) {
            res.status(404).json({
                success: false,
                message: "User cant be deleted as book not returned"
            });
        }
    });

    const index = users.indexOf(user);
    users.splice(index, 1);
    res.status(200).json({
        success: true,
        data: users,
    })


});

app.all("*", (req, res) => {
    res.status(404).json({
        message: "This route does not exist"
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});

