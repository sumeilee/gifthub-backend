const itemModel = require("../models/itemModel");

const controllers = {
    createItem: (req, res) => {
        itemModel.create({
            title: req.body.title,
            postType: req.body.type,
            description: req.body.description,
            category: req.body.category,
            images: req.body.images,
            delivery: req.body.delivery,
            status: req.body.status,
            tags: req.body.tags,
            postedBy: req.body.postedBy, //to review in frontend
        });
    },
};

module.exports = controllers;
