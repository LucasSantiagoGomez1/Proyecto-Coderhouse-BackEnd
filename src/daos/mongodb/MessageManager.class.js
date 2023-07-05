import mongoose from "mongoose";
import { messageModel } from "./models/messages.model.js";

export default class MessageManager {
  connection = mongoose.connect('mongodb+srv://LucasGomez:Patabilla100@cluster0.c1sjpqg.mongodb.net/?retryWrites=true&w=majority')

  async getMessages() {
    let result = await messageModel.find({})
    return result
  }

  async addMessage(message) {
    let result = await messageModel.create(message)
    return result
  }


}