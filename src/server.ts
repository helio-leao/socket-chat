import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const rooms: { [key: string]: { users: { [key: string]: string } } } = {};

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public"));
});

io.on("connection", (socket) => {
  socket.on("new-user", (data: { user: string; room: string }) => {
    const { user, room } = data;

    if (rooms[room] == null) {
      rooms[room] = { users: {} };
    }

    rooms[room].users[socket.id] = user;

    socket.join(room);
    socket.to(room).emit("user-connected", user);
  });

  socket.on("send-chat-message", (data: { room: string; message: string }) => {
    const { room, message } = data;
    socket.to(room).emit("chat-message", {
      user: rooms[room].users[socket.id],
      message,
    });
  });

  socket.on("disconnect", () => {
    const userRooms = getUserRooms(socket.id);

    userRooms.forEach((room) => {
      socket.to(room).emit("user-disconnected", rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
    });
  });
});

function getUserRooms(socketId: string) {
  const userRooms = [];

  for (let room in rooms) {
    if (rooms[room].users[socketId] != null) {
      userRooms.push(room);
    }
  }
  return userRooms;
}

server.listen(3000, () => console.log("Server listening on port 3000..."));
