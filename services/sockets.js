const UserSocket = require("../models/socketModel");

exports.getUserSocket = async (user) => {
  return UserSocket.findOne({
    user,
  });
};

exports.deleteUserSocket = async (socket) => {
  console.log(`deleting socket ${socket}`);
  return UserSocket.deleteOne({ socket });
};

exports.createUserSocket = async (user, socket) => {
  const userSocket = await this.getUserSocket(user);

  if (userSocket) {
    this.deleteUserSocket(userSocket.socket);
  }

  return UserSocket.create({
    user,
    socket,
  });
};
