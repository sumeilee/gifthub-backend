require("dotenv").config();

const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://gifthubsg.herokuapp.com"
        : "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 5000;

const userController = require("./controllers/userController");
const itemController = require("./controllers/ItemController");
const transactionController = require("./controllers/TransactionController");
const conversationController = require("./controllers/conversationController");
const messageController = require("./controllers/messageController");

const messageModel = require("./models/messageModel");

const {
  getUserSocket,
  createUserSocket,
  deleteUserSocket,
} = require("./services/sockets");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
const mongoURI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;
mongoose.set("useFindAndModify", false);

const verifyToken = (req, res, next) => {
  const authToken = req.headers.auth_token;

  if (!authToken) {
    res.status(500).json({
      success: false,
      message: "Auth header value is missing",
    });
    return;
  }

  try {
    const userData = jwt.verify(authToken, process.env.JWT_SECRET, {
      algorithms: ["HS384"],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Auth token is invalid",
    });
    return;
  }

  next();
};

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    success: true,
    message: "gifthub api reached",
  });
});

// ROUTES

// ITEM ROUTES
app.get("/api/v1/offers", itemController.listOffers);
app.get("/api/v1/requests", itemController.listRequests);
app.get("/api/v1/items/:id", itemController.getItem);
app.post("/api/v1/items", verifyToken, itemController.createItem);
app.patch("/api/v1/items/:id", verifyToken, itemController.updateItem);
app.delete("/api/v1/items/:id", verifyToken, itemController.deleteItem);

// TRANSACTION ROUTES
app.get(
  "/api/v1/transactions/:id",
  verifyToken,
  transactionController.getTransaction
);
app.post(
  "/api/v1/transactions",
  verifyToken,
  transactionController.createTransaction
);

// USER ROUTES
app.post("/api/v1/user/register", userController.registerUser); // registration post
app.post("/api/v1/user/login", userController.userLogin); // login post
app.get("/api/v1/users/me", verifyToken, userController.userProfile); // get user profile
app.get("/api/v1/users/items", verifyToken, userController.userItems); // get user items
app.patch("/api/v1/users/me", verifyToken, userController.updateUser); // update route

// MESSAGE ROUTES
app.get(
  "/api/v1/conversations/:id",
  verifyToken,
  conversationController.getConversation
);
app.get(
  "/api/v1/conversations",
  verifyToken,
  conversationController.getConversations
);
app.post(
  "/api/v1/conversations",
  verifyToken,
  conversationController.createConversation
);

app.get("/api/v1/messages", verifyToken, messageController.getMessages);
app.post("/api/v1/messages", verifyToken, messageController.createMessage);
app.get("/api/v1/messages/:id", verifyToken, messageController.getMessage);
app.patch("/api/v1/messages/:id", verifyToken, messageController.updateMessage);
app.delete(
  "/api/v1/messages/:id",
  verifyToken,
  messageController.deleteMessage
);

io.on("connection", (socket) => {
  console.log(`new socket connection: ${socket.id}`);

  socket.on("disconnect", async () => {
    const response = await deleteUserSocket(socket.id);
    if (response.n > 0) {
      console.log(`userSocket for ${socket.id} deleted`);
    } else {
      console.log(`userSocket for ${socket.id} not found`);
    }
  });

  socket.on("login", async (user) => {
    try {
      const userSocket = await createUserSocket(user, socket.id);

      if (process.env.DEBUG == "true") {
        if (userSocket) {
          console.log(userSocket);
        } else {
          console.log("user socket not created");
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  });
});

try {
  messageModel.watch().on("change", async (data) => {
    const message = data.fullDocument;
    const recipient = message.recipient;

    try {
      const userSocket = await getUserSocket(recipient);
      console.log(`emitting message to ${userSocket.socket}`);
      io.to(userSocket.socket).emit("message", message);
    } catch (err) {
      console.log(err.message);
    }
  });
} catch (err) {
  console.log(err);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB connection successful");
    server.listen(port, () => {
      console.log(`App listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
