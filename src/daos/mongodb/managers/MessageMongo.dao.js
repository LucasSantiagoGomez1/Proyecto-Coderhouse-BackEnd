import mongoose from "mongoose";
import { messageModel } from "../models/messages.model.js";
import config from "../../../config.js";

export default class MessageManager {
  connection = mongoose.connect(config.MONGO_URL)
  
  async getMessages() {
    let result = await messageModel.find({})
    return result
  }

  async addMessage(message) {
    let result = await messageModel.create(message)
    return result
  }

}