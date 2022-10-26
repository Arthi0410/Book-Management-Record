const express = require("express");
const { users } = require("../data/users.json");

const router = express.Router();


/**
 * Route: /users
 * Method: GET
 * Description: Get all users
 * Access: Public
 * Parameters:None 
 */
router.get("/", (req, res) => {
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

router.get("/:id", (req, res) => {
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

router.post("/", (req, res) => {

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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const user = users.find((each) => each.id === id)

    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const index = users.indexOf(user);
    users.splice(index, 1);
    res.status(200).json({
        success: true,
        data: users,
    })


});

/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Getting all user subscription details
 * Access: Public
 * Parameters:id
 */
router.get("/subscription-details/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user) {
        res.status(404).json({
            sccess: false,
            message: "User not found"
        });
    }

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

    const returnDate = getDateinDays(users.returnDate);
    const currentDate = getDateinDays();
    const subscriptionDate = getDateinDays(users.subscriptionDate);
    const expirationDate = subscriptionType(subscriptionDate);


    console.log("Return Date ", returnDate);
    console.log("Current Date ", currentDate);
    console.log("Subscription Date ", subscriptionDate);
    console.log("Subscription expiry date", expirationDate);

    const data = {
        ...user,
        subscriptionExpired: expirationDate < currentDate,
        daysleftforexpiration: expirationDate <= currentDate ? 0 : expirationDate - currentDate,
        fine: returnDate < currentDate ? expirationDate <= currentDate ? 200 : 100 : 0,
    }

    res.status(200).json({
        success: true,
        data,
    });

});



module.exports = router;