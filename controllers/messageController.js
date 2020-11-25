const services = require("./../services/message");

const messageController = {
  createMessage: async (req, res) => {
    const { author, message, attachments, conversation } = req.body;

    try {
      const doc = await services.createMessage(
        conversation,
        author,
        message,
        attachments
      );

      if (doc) {
        res.status(201).json({
          success: true,
          message: doc,
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

  getMessages: async (req, res) => {
    const { conversation, asc } = req.query;

    try {
      let messages;

      if (conversation) {
        messages = await services.getMessagesByConversation(conversation, asc);
      } else {
        throw Error("Please provide conversation ID");
      }

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
      const doc = await services.updateMessage(id, message, attachments);

      res.status(200).json({
        success: true,
        message: doc,
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
      const response = await services.deleteMessage(id);

      if (response.n === 0) {
        res.status(401).json({
          success: false,
          message: "Message not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Message deleted",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error deleting message",
      });
    }
  },
};

module.exports = messageController;
