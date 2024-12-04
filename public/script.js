const socket = io();

const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");

const userName = prompt("What is your name?") || "Guest";

appendMessage("You joined!");
socket.emit("new-user", userName);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("send-chat-message", input.value);
    appendMessage(`You: ${input.value}`);
    input.value = "";
  }
});

socket.on("chat-message", (data) => {
  appendMessage(`${data.user}: ${data.message}`);
});

socket.on("user-connected", (user) => {
  appendMessage(`${user} connected`);
});

socket.on("user-disconnected", (user) => {
  appendMessage(`${user} disconnected`);
});

function appendMessage(message) {
  const item = document.createElement("li");
  item.textContent = message;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}
