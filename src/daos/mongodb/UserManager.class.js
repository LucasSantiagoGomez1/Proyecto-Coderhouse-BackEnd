import mongoose from "mongoose";
import { userModel } from "./models/users.model.js";

export default class UserManager {
  connection = mongoose.connect('mongodb+srv://LucasGomez:Patabilla100@cluster0.c1sjpqg.mongodb.net/?retryWrites=true&w=majority')
  
  async addUser(user) {
    try {
      let result = await userModel.create(user)

      return result
    }
    catch(error) {
      throw new Error("User couldn't be created")
    }
  }

  async findUser(email, password) {
    let result = await userModel.findOne({email: email, password: password})

    return result
  }
}