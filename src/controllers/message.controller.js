import MessageManager from "../daos/mongodb/managers/MessageManager.class.js";

let messageManager = new MessageManager()

const getMessages = async (req, res) => {
  let messages = await messageManager.getMessages()

  res.send(messages)
}

const addMessage = async (req, res) => {
  let newMessage = req.body

  await messageManager.addMessage(newMessage)
  req.socketServer.emit("update-messages", await messageManager.getMessages())

  res.send({status: "success"})
}

export default {
  getMessages,
  addMessage
}