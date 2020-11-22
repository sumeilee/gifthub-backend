const userModel = require("../models/userModel");
const uuid = require("uuid");
const SHA256 = require("crypto-js/sha256");
const jwt = require("jsonwebtoken");

const userController = {
  registerUser: (req, res) => {
    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.userType
    ) {
      res.statusCode = 400;
      message = "Required fields cannot be left blank";
      res.json({
        success: false,
        message: message,
      });
      return;
    }

    userModel
      .findOne({email: req.body.email})

      .then((user) => {
        if (user) {
          res.statusCode = 400;
          res.json({
            success: false,
            message: "Email already exists",
          });
          return;
        }
        const salt = uuid.v4();
        const combination = salt + req.body.password;

        const hash = SHA256(combination).toString();

        userModel
          .create({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            pwsalt: salt,
            hash: hash,
            userType: req.body.userType,
            organisation: req.body.organisation,
          })
          .then((createUser) => {
            res.json({
              success: true,
              message: "User created",
            });
          })
          .catch((err) => {
            res.json({
              success: false,
              message: "Error",
            });
          });
      });
  },
};

module.exports = userController;
