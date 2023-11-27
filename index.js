import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import path from "node:path";

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors);
const server = createServer(app);
const io = new Server(server, { cors: true });
const connectedUsers = {};

io.on("connection", (socket) => {
  // For simplicity, let's assume the client sends the user information during connection
  socket.on("message", (data) => {
    console.log("from msg", data);
    const Chatdata = {
      msg: data.message,
      author: data.author,
      time: data.time,
    };
    io.emit("recive_msg", Chatdata);
  });
  socket.on("join", (user) => {
    // When a new user connects, add them to the list of connected users
    connectedUsers[socket.id] = {
      socketId: socket.id,
      userName: user.userName,
      email: user.email,
    };

    console.log("User connected:", user.userName, user.email);

    // Send the updated list of connected users to all clients
    io.emit("connectedUsers", connectedUsers);

    // When a user disconnects, remove them from the list of connected users
    socket.on("disconnect", () => {
      delete connectedUsers[socket.id];
      console.log("User disconnected:", user.userName, user.email);

      // Send the updated list of connected users to all clients
      io.emit("connectedUsers", connectedUsers);
    });
  });
});
// const ___dirnaame1 = path.resolve();
// app.use(express.static(path.join(___dirnaame1, "/frontend/build")));
server.listen(PORT, () => {
  console.log("server running at http://localhost:4000", PORT);
});
