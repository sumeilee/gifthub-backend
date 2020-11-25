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
};

module.exports = messageService;
