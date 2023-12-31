const socket = io();

let sendMsgBtn = document.getElementById("send-message-btn")
let messageInput = document.getElementById("message-input")

let user = ""

Swal.fire({
  title: "Identifícate con tu email",
  input: "email",
  inputValidator: (value) => {
    if (!value) {
      return "Necesitas escribir un email para identificarte"
    }
    return false
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
});

socket.on("update-messages", (messages) => {
  let chatContainer = document.getElementById("chat-container")
  chatContainer.innerHTML = ""

  for (message of messages) {
    let messageElement = document.createElement("p")
    messageElement.innerHTML = `${message.user}: ${message.message}`

    chatContainer.appendChild(messageElement)
  }
})

messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendMsgBtn.click();
  }
})

sendMsgBtn.addEventListener('click', () => {
  socket.emit("new-message", {user: user, message: messageInput.value})
  messageInput.value = ""
})