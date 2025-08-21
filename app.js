// Simple login system with two users
const users = {
  "Mercy": "Mercy123",
  "Rahl": "Rahl123"
};

// Handle login
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  if (users[username] && users[username] === password) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "chat.html";
  } else {
    error.textContent = "Invalid username or password!";
  }
}

// Protect chat page
if (window.location.pathname.includes("chat.html")) {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    window.location.href = "index.html";
  }
}

// Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// Simple chat system (local only)
function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();
  if (message) {
    const messagesDiv = document.getElementById("messages");
    const msgEl = document.createElement("p");
    msgEl.textContent = localStorage.getItem("loggedInUser") + ": " + message;
    messagesDiv.appendChild(msgEl);
    input.value = "";
  }
}
