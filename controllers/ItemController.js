const { deleteModel } = require("mongoose");
const itemModel = require("../models/itemModel");

const controllers = {
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

                // tidy code later
                const itemUpdates = {
                    title: req.body.title,
                    postType: req.body.type,
                    description: req.body.description,
                    category: req.body.category,
                    images: req.body.images,
                    delivery: req.body.delivery,
                    status: req.body.status,
                    tags: req.body.tags,
                    postedBy: req.body.postedBy, //to review in frontend
                };

                for (const prop in itemUpdates) {
                    if (!itemUpdates[prop]) {
                        delete itemUpdates[prop];
                        console.log(prop + " deleted");
                    }
                }
                console.log(itemUpdates);

                itemModel
                    .findOneAndUpdate(
                        {
                            _id: req.params.id,
                        },
                        {
                            // improve code later:ternary operator?
                            $set: itemUpdates,
                        }
                    )
                    .then((result) => {
                        // console.log(req.body);
                        console.log(result);

                        // validate data later
                        // try {
                        //     // try to execute potentially problematic code
                        // } catch (err) {
                        //     // code for resolving error from above
                        // }
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

module.exports = controllers;
