const userModel = require("../models/userModel");
const itemModel = require("../models/itemModel");
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

  userLogin: (req, res) => {
    if (!req.body.email || !req.body.password) {
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
      .then((result) => {
        if (!result) {
          res.statusCode = 401;
          res.json({
            success: false,
            message: "Incorrect email or password!",
          });
          return;
        }
        const hash = SHA256(result.pwsalt + req.body.password).toString();

        if (hash !== result.hash) {
          res.statusCode = 401;
          res.json({
            success: false,
            message: "Incorrect email or password!",
          });
          return;
        }
        const token = jwt.sign(
          {
            id: result._id,
            first_name: result.first_name,
            last_name: result.last_name,
            email: result.email,
          },
          process.env.JWT_SECRET,
          {
            algorithm: "HS384",
            expiresIn: "1h",
          }
        );
        const rawJWT = jwt.decode(token);

        res.json({
          success: true,
          token: token,
          expiresAt: rawJWT.exp,
          message: "login successful",
        });
      })

      .catch((err) => {
        res.statusCode = 500;
        res.json({
          success: false,
          message: "unable to login due to unexpected error",
        });
      });
  },

  userProfile(req, res) {
    const authToken = req.headers.auth_token;
    if (!authToken) {
      res.json({
        success: false,
        message: "Auth header value is missing",
      });
      return;
    }
    try {
      const userData = jwt.verify(authToken, process.env.JWT_SECRET, {
        algorithms: ["HS384"],
      });

      res.json({
        success: true,
        user: userData,
      });
    } catch (err) {
      res.json({
        success: false,
        message: "Auth token is invalid",
      });
      return;
    }
  },
  updateUser(req, res) {
    const authToken = req.headers.auth_token;
    let userData;

    if (!authToken) {
      res.json({
        success: false,
        message: "Auth header value is missing",
      });
      return;
    }
    try {
      userData = jwt.verify(authToken, process.env.JWT_SECRET, {
        algorithms: ["HS384"],
      });
    } catch (err) {
      res.json({
        success: false,
        message: "Auth token is invalid",
      });
      return;
    }

    const salt = uuid.v4();
    let hash;
    if (req.body.password !== "") {
      const combination = salt + req.body.password;

      hash = SHA256(combination).toString();
    }
    const updateObj = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      organisation: req.body.organisation,
    };
    if (hash) {
      updateObj.pwsalt = salt;
      updateObj.hash = hash;
    }

    userModel
      .updateOne(
        {
          _id: userData.id,
        },
        updateObj
      )
      .then((profileUpdated) => {
        if (profileUpdated) {
          res.json({
            success: true,
            message: "user updated!",
          });
          return;
        }
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({
          success: false,
          message: "An unexpected error has occured",
        });
      });
  },

  userItems: (req, res) => {
    const authToken = req.headers.auth_token;
    let userData;

    if (!authToken) {
      res.json({
        success: false,
        message: "Auth header value is missing",
      });
      return;
    }
    try {
      userData = jwt.verify(authToken, process.env.JWT_SECRET, {
        algorithms: ["HS384"],
      });
      // res.json(userData);
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Auth token is invalid",
      });
      return;
    }

    itemModel
      .find({
        postedBy: userData.id,
      })
      .then((itemResult) => {
        res.json({
          success: true,
          message: "item listed",
          items: itemResult,
        });
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

module.exports = userController;
