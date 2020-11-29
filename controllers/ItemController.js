const mongoose = require("mongoose");
const itemModel = require("../models/itemModel");

const itemControllers = {
    getItem: (req, res) => {
        itemModel
            .findOne({
                _id: req.params.id,
            })
            // .populate("postedBy", "first_name last_name"); // check
            .then((result) => {
                if (!result) {
                    console.log(err);
                    res.statusCode = 404;
                    res.json("Error in retrieving item from db"); //review msg
                    return;
                }
                res.json(result);
            })
            .catch((err) => {
                console.log(err);
                res.statusCode = 500;
                res.json("No such item found in db"); //review msg
            });
    },
    listOffers: (req, res) => {
        itemModel
            .find({
                postType: {
                    $eq: "Offer",
                },
            })
            .then((results) => {
                if (!results) {
                    console.log(err);
                    res.statusCode = 404;
                    res.json("Error in retrieving offers from db"); //review msg
                    return;
                }
                res.json(results);
            })
            .catch((err) => {
                console.log(err);
                res.statusCode = 500;
                res.json("No offers found in db"); //review msg
            });
    },
    listRequests: (req, res) => {
        itemModel
            .find({
                postType: {
                    $eq: "Request",
                },
            })
            .then((results) => {
                if (!results) {
                    console.log(err);
                    res.statusCode = 404;
                    res.json("Error in retrieving offers from db"); //review msg
                    return;
                }
                res.json(results);
            })
            .catch((err) => {
                console.log(err);
                res.statusCode = 500;
                res.json("No requests found in db"); //review msg
            });
    },
    createItem: (req, res) => {
        console.log(req.body);
        itemModel
            .create({
                title: req.body.title,
                postType: req.body.type,
                description: req.body.description,
                category: req.body.category,
                images: req.body.images,
                delivery: req.body.delivery,
                status: req.body.status,
                tags: req.body.tags,
                postedBy: req.body.postedBy, //to review in frontend
            })
            .then((result) => {
                res.json({
                    success: true,
                    message: "item successfully created",
                });
            })
            .catch((err) => {
                console.log(err);
                res.statusCode = 500; // to check
                res.json({
                    success: false,
                    message: "create item failed",
                });
            });
    },
    // getItem: (req, res) => {
    //     res.json("get item");
    // },

    updateItem: (req, res) => {
        console.log(req.params.id);
        // to improve code later

        itemModel
            .findOne({
                _id: req.params.id,
            })
            .then((result) => {
                if (!result) {
                    res.statusCode = 404;
                    res.json({
                        success: false,
                        message: "No item with that ID found",
                    });
                    return;
                }

                // check if any input fields were left blank
                const itemUpdates = {};
                const formValues = req.body;
                let updateNum = 0;

                for (const prop in formValues) {
                    if (formValues[prop]) {
                        itemUpdates[prop] = formValues[prop];
                        updateNum += 1;
                    }
                }

                if (updateNum === 0) {
                    res.statusCode = 404; // to check
                    res.json({
                        success: false,
                        message: "No fields were updated. Please try again.",
                    });
                    return;
                }

                itemModel
                    .findOneAndUpdate(
                        {
                            _id: req.params.id,
                        },
                        {
                            $set: itemUpdates,
                        },
                        // check against schema enum values
                        { runValidators: true }
                    )
                    .then((result) => {
                        console.log(req.body);
                        console.log(result);

                        res.json({
                            success: true,
                            message: "item successfully updated",
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.statusCode = 500; // to check
                        res.json({
                            success: false,
                            message: "update item failed",
                        });
                    });
            })
            .catch((err) => {
                console.log(err);
                res.statusCode = 500; // to check
                res.json({
                    success: false,
                    message: "update item failed",
                });
            });
    },

    deleteItem: (req, res) => {
        // to improve code later
        console.log(req.params.id);

        itemModel
            .findOne({
                _id: req.params.id,
            })
            .then((result) => {
                if (!result) {
                    res.statusCode = 404;
                    res.json({
                        success: false,
                        message: "No item with that ID found",
                    });
                    return;
                }
                itemModel
                    .findOneAndDelete({
                        _id: req.params.id,
                    })
                    .then((result) => {
                        console.log(req.body);
                        console.log(result);
                        res.json({
                            success: true,
                            message: "item successfully deleted",
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.statusCode = 500; // to check
                        res.json({
                            success: false,
                            message: "delete item failed",
                        });
                    });
            })
            .catch((err) => {
                console.log(err);
                res.statusCode = 500; // to check
                res.json({
                    success: false,
                    message: "delete item failed",
                });
            });
    },
};

module.exports = itemControllers;
