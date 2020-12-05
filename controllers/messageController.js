const conversationModel = require("./../models/conversationModel");
const messageModel = require("./../models/messageModel");

const messageController = {
  createMessage: async (req, res) => {
    const { author, recipient, message, attachments, conversation } = req.body;

    try {
      if (!conversation || !author || !message || !recipient) {
        res.status(400).json({
          success: false,
          message:
            "Conversation, author, recipient and message must be provided",
        });
        return;
      }

      const doc = await conversationModel.findOne({
        _id: conversation,
      });

      if (!doc) {
        res.status(400).json({
          success: false,
          message: "Conversation not found",
        });
        return;
      }

      if (!doc.users.includes(author)) {
        res.status(400).json({
          success: false,
          message: "Author is not of conversation provided",
        });
        return;
      }

      const msg = await messageModel.create({
        conversation,
        author,
        recipient,
        message,
        attachments,
      });

      if (msg) {
        doc.lastMessage = msg._id;
        doc.updatedAt = Date.now();
        await doc.save();

        res.status(201).json({
          success: true,
          message: msg,
        });
      } else {
        throw Error("Error creating message");
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  getMessage: async (req, res) => {
    const { id } = req.params;

    try {
      const message = await messageModel
        .findOne({ _id: id })
        .populate("author", "first_name last_name");

      if (!message) {
        res.status(404).json({
          sucess: false,
          message: "Message not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  getMessages: async (req, res) => {
    const { conversation, asc } = req.query;

    try {
      let sortOrder = 1;

      if (asc == -1) {
        sortOrder = -1;
      }

      if (!conversation) {
        res.status(400).json({
          success: false,
          message: "Conversation must be provided",
        });
        return;
      }

      const messages = await messageModel
        .find({ conversation })
        .populate("author", "first_name last_name")
        .sort({ postedAt: sortOrder });

      // if (messages.length === 0) {
      //   res.status(404).json({
      //     success: false,
      //     message: "No messages found",
      //   });
      //   return;
      // }
      res.status(200).json({
        success: true,
        messages,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  updateMessage: async (req, res) => {
    const { id } = req.params;
    const { message, attachments } = req.body;

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

  deleteMessage: async (req, res) => {
    const { id } = req.params;

    try {
      const response = await messageModel.deleteOne({ _id: id });

      if (response.n === 0) {
        res.status(404).json({
          success: false,
          message: "Message not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Message deleted",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error deleting message",
      });
    }
  },
};

module.exports = messageController;
