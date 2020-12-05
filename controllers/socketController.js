const UserSocket = require("../models/socketModel");
const { createUserSocket } = require("../services/sockets");

const socketController = {
  createUserSocket: async (req, res) => {
    const { user, socket } = req.body;

    try {
      const userSocket = await createUserSocket(user, socket);

      res.status(201).jsons({
        success: true,
        userSocket,
      });
    } catch (err) {
      res.json(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  updateUserSocket: async (req, res) => {
    const { user } = req.query;
    const { socket } = req.body;

    try {
      const msg = await messageModel.findOne({ _id: id });

      if (!msg) {
        res.status(404).json({
          success: false,
          message: "Message not found",
        });
        return;
      }

      msg.message = message;
      msg.attachments = attachments;
      msg.updatedAt = Date.now();

      await msg.save();

      res.status(200).json({
        success: true,
        message: msg,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
};

module.exports = socketController;
