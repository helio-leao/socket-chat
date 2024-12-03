import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

// Initialize Express and the server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (like CSS, JS, images) from the "public" directory
app.use(express.static(path.join(__dirname, "..", "public")));

// Serve a basic HTML file
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public"));
});

// Listen for client connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for chat messages
  socket.on("chat message", (msg) => {
    console.log("Message: " + msg);
    io.emit("chat message", msg); // Broadcast message to everyone
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
