const conversationModel = require("./../models/conversationModel");
const itemModel = require("./../models/itemModel");

const conversationService = {
  createConversation: async (participants, item) => {
    const response = await itemModel.findOne({ _id: item });

    // if (!participants.includes(item.postedBy)) {
    //   console.log("Conversation must include owner of item");
    //   return;
    // }

    return conversationModel.create({
      participants,
      item: response._id,
    });
  },

  getConversation: (participants, item) => {
    return conversationModel.findOne({
      participants: { $all: participants },
      item,
    });
  },
};

module.exports = conversationService;
