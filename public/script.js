const socket = io();

const userForm = document.getElementById("user-form");
const userInput = document.getElementById("user-input");
const roomInput = document.getElementById("room-input");

const messages = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

let user = null;
let room = null;

socket.on("chat-message", (data) => {
  appendMessage(`${data.user}: ${data.message}`);
});

socket.on("user-connected", (user) => {
  appendMessage(`${user} connected`);
});

socket.on("user-disconnected", (user) => {
  appendMessage(`${user} disconnected`);
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = messageInput.value;

  if (!user || !room || !message) return;

  socket.emit("send-chat-message", { room, message });
  appendMessage(`You: ${message}`);
  messageInput.value = "";
});

userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  user = userInput.value.trim();
  room = roomInput.value.trim();

  if (!user || !room) return;

  socket.emit("new-user", { user, room });
  appendMessage("You joined!");
});

function appendMessage(message) {
  const item = document.createElement("li");
  item.textContent = message;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}
