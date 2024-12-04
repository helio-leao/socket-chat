import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const users: { [key: string]: string } = {};

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public"));
});

io.on("connection", (socket) => {
  socket.on("new-user", (username: string) => {
    users[socket.id] = username;
    socket.broadcast.emit("user-connected", username);
  });

  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", { user: users[socket.id], message });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(3000, () => console.log("Server listening on port 3000..."));
