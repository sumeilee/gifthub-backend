const messageModel = require("./../models/messageModel");

const messageService = {
  createMessage: (conversation, author, message, attachments) => {
    if (!conversation) {
      throw Error("Message must be attached to a Conversation");
    }

    if (!author || !message) {
      throw Error("Author and message must be provided");
    }

    return messageModel.create({
      conversation,
      author,
      message,
      attachments,
    });
  },

  getMessagesByConversation: (id, asc = true) => {
    let sortOrder = 1;

    if (!asc) {
      sortOrder = -1;
    }

    return messageModel
      .find({ conversation: id })
      .sort({ postedAt: sortOrder });
  },

  updateMessage: async (id, message, attachments) => {
    const doc = await messageModel.findOne({ _id: id });

    if (!doc) {
      throw Error("Message not found");
    } else {
      doc.message = message;
      doc.attachments = attachments;
      doc.updatedAt = Date.now();

      return doc.save();
    }
  },

  deleteMessage: (id) => {
    return messageModel.deleteOne({ _id: id });
  },
};

module.exports = messageService;
