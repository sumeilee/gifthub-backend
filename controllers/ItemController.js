const itemModel = require("../models/itemModel");

const controllers = {
    createItem: (req, res) => {
        itemModel.create({
            name: req.body.name,
            postType: req.body.type,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            images: req.body.images,
            delivery: req.body.delivery,
            status: req.body.status,
            tags: req.body.tags,
        });
    },
};

module.exports = controllers;
