const conversationModel = require("./../models/conversationModel");
const itemModel = require("./../models/itemModel");

const conversationControllers = {
  createConversation: async (req, res) => {
    const { users, item } = req.body;
    // console.log(`item: ${item}`);
    try {
      const doc = await itemModel.findOne({ _id: item });
      // console.log(doc);
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
    const { user, users, item } = req.query;
    let findObj;

    try {
      if (user) {
        findObj = {
          users: user,
        };
      } else if (users && item) {
        const usersArr = users.split(",");

        findObj = {
          users: { $all: usersArr },
          item: item,
        };
      } else {
        res.status(400).json({
          success: false,
          message: "Please provide the necessary query parameters",
        });
        return;
      }

      const conversations = await conversationModel
        .find(findObj)
        .populate("users", "first_name last_name")
        .populate({
          path: "lastMessage",
          populate: { path: "author", select: { first_name: 1, last_name: 1 } },
        })
        .sort({ updatedAt: -1 });

      res.status(200).json({
        success: true,
        conversations,
      });

      // if (conversations.length > 0) {
      //   res.status(200).json({
      //     success: true,
      //     conversations,
      //   });
      // } else {
      //   res.status(404).json({
      //     success: false,
      //     message: "No conversations found",
      //   });
      // }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  getConversation: async (req, res) => {
    const { id } = req.params;

    try {
      const conversation = await conversationModel.findOne({ _id: id });

      if (!conversation) {
        res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        conversation,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
};

module.exports = conversationControllers;
