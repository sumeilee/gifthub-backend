const services = require("../services/conversation");

const conversationControllers = {
  createConversation: async (req, res) => {
    const { participantsStr, item } = req.body;
    const participants = participantsStr.split(",");

    try {
      const conversation = await services.createConversation(
        participants,
        item
      );

      if (conversation) {
        res.status(201).json({
          success: true,
          conversation,
        });
      } else {
        throw Error("Error creating conversation");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  getConversation: async (req, res) => {
    const { participants, item } = req.body;

    try {
      const conversation = await services.getConversation(participants, item);

      if (conversation) {
        res.status(200).json({
          success: true,
          conversation,
        });
      } else {
        res.json({
          success: false,
          message: "No conversations found",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Error retrieving conversation",
      });
    }
  },
};

module.exports = conversationControllers;
