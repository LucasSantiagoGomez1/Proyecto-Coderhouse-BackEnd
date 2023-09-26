import mongoose from "mongoose";
import UserService from "../../src/services/user.service.js";
import chai from "chai";

const connection = mongoose.connect('mongodb+srv://LucasGomez:Patabilla100@cluster0.c1sjpqg.mongodb.net/?retryWrites=true&w=majority');

describe('Unit testing Sessions', ()=>{
  this.timeout(10000)

  before(async function() {
      this.timeout(10000)

      await mongoose.connection.collections.users.drop()
      this.userService = new UserService()
  })

  after(async function() {
    await mongoose.disconnect()
    console.log("Se cerro la conexion en Users Test")
  })

    // Testeos unitarios de usuarios
  
  it('Se agrega un usuario', async function() {
    let mockUser = {
      first_name: "Pepe",
      last_name: "Pepon",
      email: "pepe@gmail.com",
      age: 24,
      password: "123"
    }

    await this.userService.addUser(mockUser)

    let user = await this.userService.findUser("pepe@gmail.com")

    return chai.expect(user).to.have.property("_id")
  })

  it('Se actualiza el rol de un usuario', async function() {
    let mockUser = {
      first_name: "Pepe",
      last_name: "Pepon",
      email: "pepe@gmail.com",
      age: 24,
      password: "123"
    }

    let user = await this.userService.addUser(mockUser)

    chai.expect(user).to.have.property("role").and.to.be.equal("user")

    await this.userService.updateUserRole(user._id, "premium")

    user = await this.userService.findUser("pepe@gmail.com")

    return chai.expect(user).to.have.property("role").and.to.be.equal("premium")
  })

  it('Se actualiza la contrasenia de un usuario', async function() {
    let mockUser = {
      first_name: "Pepe",
      last_name: "Pepon",
      email: "pepe@gmail.com",
      age: 24,
      password: "123"
    }

    let user = await this.userService.addUser(mockUser)

    chai.expect(user).to.have.property("password").and.to.be.equal("123")

    await this.userService.updatePassword("pepe@gmail.com", "12345")

    user = await this.userService.findUser("pepe@gmail.com")

    return chai.expect(user).to.have.property("password").and.to.be.equal("12345")
  })

})