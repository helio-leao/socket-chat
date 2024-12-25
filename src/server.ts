import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const PORT = process.env.PORT || 3000;

const rooms: { [key: string]: { users: { [key: string]: string } } } = {};

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "..", "public")));

io.on("connection", (socket) => {
  socket.on("new-user", (data: { user: string; room: string }) => {
    // remove user from previous room
    const prevRoom = getUserRoom(socket.id);

    if (prevRoom) {
      socket.leave(prevRoom);
      removeUserFromRoom(socket.id, prevRoom);
    }

    // add user to new room
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
    const room = getUserRoom(socket.id);

    if (!room) return;

    socket.to(room).emit("user-disconnected", rooms[room].users[socket.id]);
    removeUserFromRoom(socket.id, room);
  });
});

function getUserRoom(socketId: string) {
  for (let room in rooms) {
    if (rooms[room].users[socketId] != null) {
      return room;
    }
  }
  return null;
}

function removeUserFromRoom(socketId: string, room: string) {
  // remove user from room
  delete rooms[room].users[socketId];
  // remove room if empty
  if (Object.keys(rooms[room].users).length === 0) {
    delete rooms[room];
  }
}

server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
