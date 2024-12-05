const socket = io();

const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");

const user = prompt("What is your name?") || "Guest";
const room = prompt("Room name...");

appendMessage("You joined!");
socket.emit("new-user", { user, room });

socket.on("chat-message", (data) => {
  appendMessage(`${data.user}: ${data.message}`);
});

socket.on("user-connected", (user) => {
  appendMessage(`${user} connected`);
});

socket.on("user-disconnected", (user) => {
  appendMessage(`${user} disconnected`);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = input.value;

  socket.emit("send-chat-message", { room, message });
  appendMessage(`You: ${message}`);
  input.value = "";
});

function appendMessage(message) {
  const item = document.createElement("li");
  item.textContent = message;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}
