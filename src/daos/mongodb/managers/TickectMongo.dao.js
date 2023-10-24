import mongoose from "mongoose";
import { ticketsModel } from "../models/ticket.model.js";

export default class TicketManager {
  connection = mongoose.connect('mongodb+srv://LucasGomez:Patabilla100@cluster0.c1sjpqg.mongodb.net/?retryWrites=true&w=majority')

  async createTicket(ticket) {
    let result = await ticketsModel.create(ticket)

    return result
  }

  async getTicketById(id) {
    let result = await ticketsModel.findOne({ _id: id })

    return result
  }
}