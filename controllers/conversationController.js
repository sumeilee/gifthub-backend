const conversationModel = require("./../models/conversationModel");
const itemModel = require("./../models/itemModel");

const conversationControllers = {
  createConversation: async (req, res) => {
    const { users, item } = req.body;

    try {
      const doc = await itemModel.findOne({ _id: item });
      if (!doc) {
        res.status(400).json({
          success: false,
          message: "Conversation must be attached to existing item",
        });
        return;
      }

      if (!users.includes(doc.postedBy.toString())) {
        res.status(400).json({
          success: false,
          message: "Conversation must include owner of item",
        });
        return;
      }

      const conversation = await conversationModel.create({
        users,
        item,
      });

      if (conversation) {
        res.status(201).json({
          success: true,
          conversation,
        });
      } else {
        throw Error("Error creating conversation");
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  getConversations: async (req, res) => {
    const { user } = req.query;

    try {
      const conversations = await conversationModel
        .find({
          users: user,
        })
        .populate({
          path: "lastMessage",
          populate: { path: "author", select: { first_name: 1, last_name: 1 } },
        });

      if (conversations.length > 0) {
        res.status(200).json({
          success: true,
          conversations,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No conversations for this user found",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error getting conversations",
      });
    }
  },
};

module.exports = conversationControllers;
