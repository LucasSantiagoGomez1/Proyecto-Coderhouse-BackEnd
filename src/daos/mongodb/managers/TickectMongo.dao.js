import mongoose from "mongoose";
import { ticketsModel } from "../models/ticket.model.js";
import config from "../../../config.js";

export default class TicketManager {
  connection = mongoose.connect(config.MONGO_URL)

  async createTicket(ticket) {
    let result = await ticketsModel.create(ticket)

    return result
  }

  async getTicketById(id) {
    let result = await ticketsModel.findOne({ _id: id })

    return result
  }
}