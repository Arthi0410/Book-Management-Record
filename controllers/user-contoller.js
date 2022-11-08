const { usermodel, bookmodel } = require("../models");

exports.getallusers = async (req, res) => {
    const user = await usermodel.find();
    res.status(200).json({
        success: true,
        data: user,
    });

}

exports.getuserbyid = async (req, res) => {
    const { id } = req.params;
    const user = await usermodel.findById(id);
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
}

exports.createnewuser = async (req, res) => {

    const { data } = req.body;
    const user = await usermodel.create(data);


    res.status(200).json({
        success: true,
        data: user
    });
}

exports.updateuser = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const user = await usermodel.findOneAndUpdate({ _id: id }, data, { new: true });

    if (!user)
        return res.status(404).json({
            success: false,
            message: "User not found"
        });




    return res.status(200).json({
        success: true,
        data: user,
    });
}

exports.deleteuser = async (req, res) => {
    const { id } = req.params;

    const user = await usermodel.deleteOne(id);

    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found"
        });
    }


    res.status(200).json({
        success: true,
        message: "User deleted succesfully",
    })


}

exports.subscriptiondetailsofuser = async (req, res) => {
    const { id } = req.params;
    const user = await usermodel.find(id);
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

}