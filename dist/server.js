"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_express = __toESM(require("express"));
var import_http = __toESM(require("http"));
var import_socket = require("socket.io");
var import_path = __toESM(require("path"));
var rooms = {};
var app = (0, import_express.default)();
var server = import_http.default.createServer(app);
var io = new import_socket.Server(server);
app.use(import_express.default.static(import_path.default.join(__dirname, "..", "public")));
app.get("/", (_req, res) => {
  res.sendFile(import_path.default.join(__dirname, "..", "public"));
});
io.on("connection", (socket) => {
  socket.on("new-user", (data) => {
    const prevRoom = getUserRoom(socket.id);
    if (prevRoom) {
      socket.leave(prevRoom);
      removeUserFromRoom(socket.id, prevRoom);
    }
    const { user, room } = data;
    if (rooms[room] == null) {
      rooms[room] = { users: {} };
    }
    rooms[room].users[socket.id] = user;
    socket.join(room);
    socket.to(room).emit("user-connected", user);
  });
  socket.on("send-chat-message", (data) => {
    const { room, message } = data;
    socket.to(room).emit("chat-message", {
      user: rooms[room].users[socket.id],
      message
    });
  });
  socket.on("disconnect", () => {
    const room = getUserRoom(socket.id);
    if (!room) return;
    socket.to(room).emit("user-disconnected", rooms[room].users[socket.id]);
    removeUserFromRoom(socket.id, room);
  });
});
function getUserRoom(socketId) {
  for (let room in rooms) {
    if (rooms[room].users[socketId] != null) {
      return room;
    }
  }
  return null;
}
function removeUserFromRoom(socketId, room) {
  delete rooms[room].users[socketId];
  if (Object.keys(rooms[room].users).length === 0) {
    delete rooms[room];
  }
}
server.listen(3e3, () => console.log("Server listening on port 3000..."));
