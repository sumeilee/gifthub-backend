const services = require("./../services/message");

const messageController = {
  createMessage: async (req, res) => {
    const { author, message, attachments, conversation } = req.body;

    try {
      const response = await services.createMessage(
        conversation,
        author,
        message,
        attachments
      );

      if (response) {
        res.status(201).json({
          success: true,
          message: response,
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
};

module.exports = messageController;
