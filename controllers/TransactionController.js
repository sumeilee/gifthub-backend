const mongoose = require("mongoose");
const transactionModel = require("../models/transactionModel");

const transactionControllers = {
  getTransaction: (req, res) => {
    transactionModel
      .findOne({
        _id: req.params.id,
      })
      // .populate("postedBy", "first_name last_name"); // check
      .then((result) => {
        if (!result) {
          console.log(err);
          res.statusCode = 404;
          res.json("Error in retrieving transaction from db"); //review msg
          return;
        }
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
        res.statusCode = 500;
        res.json("No such transaction found in db"); //review msg
      });
  },

  createTransaction: (req, res) => {
    console.log(req.body);
    transactionModel
      .create({
        item: req.body.item,
        requestorID: req.body.requestorID,
        donorID: req.body.donorID,
      })
      .then((result) => {
        res.json({
          success: true,
          message: "transaction successfully created",
        });
      })
      .catch((err) => {
        console.log(err);
        res.statusCode = 500; // to check
        res.json({
          success: false,
          message: "create transaction failed",
        });
      });
  },
};

module.exports = transactionControllers;
