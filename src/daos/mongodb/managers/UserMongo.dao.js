import mongoose from "mongoose";
import { userModel } from "../models/users.model.js";
import config from "../../../config.js";

export default class UserManager {
  connection = mongoose.connect(config.MONGO_URL)

  async addUser(user, cart) {
    try {
      user.cart = cart._id
      user.last_connection = Date.now()

      let result = await userModel.create(user)

      return result
    }
    catch(error) {
      throw new Error("User couldn't be created")
    }
  }

  async findUser(email) {
    let result = await userModel.findOne({email: email})

    return result
  }

  async findUserById(id) {
    let result = await userModel.findOne({_id: id})

    return result
  }

  async updatePassword(email, newPassword) {
    let user = await userModel.findOne({email});

    if (!user) {
      throw new Error("User wasn't found")
    }

    await userModel.updateOne({_id: user._id}, {$set: {password: newPassword}});
  }
  
  async updateUserRole(id, newRole) {
    let user = await userModel.findOne({_id: id})

    if (!user) {
      throw new Error("User wasn't found")
    }

    await userModel.updateOne({_id: user._id}, {$set: {role: newRole}});
  }

  async updateUserLastConnection(id, lastConnection) {
    await userModel.updateOne({_id: id}, {$set: {last_connection: lastConnection}});
  }

  async updateUserDocuments(id, documentationFiles) {
    let user = await userModel.findOne({_id: id})
    let userDocuments = user.documents

    for (let docFile of documentationFiles) {
      let documentUpdated = false
      
      let docName = docFile.filename.split("-")[0] 

      for (let userDoc of userDocuments) {
        if (userDoc.name === docName) {
          userDoc.reference = docFile.path

          documentUpdated = true
          break;
        }
      }

      if (!documentUpdated) {
        let newUserDocument = {
          name: docName,
          reference: docFile.path
        }
        userDocuments.push(newUserDocument)
      }
    }

    await user.save()
  }

  async getAllUsers() {
    const users = await userModel.find({})

    return users
  }

  async deleteUserById(id) {
    await userModel.deleteOne({ _id: id })
  }
}