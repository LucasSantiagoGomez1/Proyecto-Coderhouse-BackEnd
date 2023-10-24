import UserManager from "../daos/mongodb/managers/UserMongo.dao.js";
import Mail from "../helpers/mail.js";
import CartService from "../services/cart.service.js"

export default class UserService {

  constructor() {
    this.userDao = new UserManager()
    this.cartService = new CartService()
  }

  async addUser(newUser) {
    let newCart = await this.cartService.createCart()

    let user = await this.userDao.addUser(newUser, newCart)

    return user
  }

  async findUser(email) {
    let user = await this.userDao.findUser(email)

    return user
  }

  async updatePassword(email, newPassword) {
    await this.userDao.updatePassword(email, newPassword)
  }

  async findUserById(id) {
    let user = await this.userDao.findUserById(id)

    return user
  }

  async updateUserRole(id, newRole) {
    await this.userDao.updateUserRole(id, newRole)
  }

  async updateUserLastConnection(id) {
    await this.userDao.updateUserLastConnection(id, Date.now())
  }

  async updateUserDocuments(id, documentationFiles) {
    await this.userDao.updateUserDocuments(id, documentationFiles)
  }

  async getAllUsers() {
    const users = await this.userDao.getAllUsers()

    return users
  }

  async deleteInactiveUsers() {
    const users = await this.getAllUsers()
    const twoDays = 172800000
    const usersToBeDeleted = []
    let mail = new Mail()

    for (let user of users) {
      const lastConnection = Number(user.last_connection)

      const moreThanTwoDays = (lastConnection + twoDays) < Date.now()

      if (moreThanTwoDays) {
        usersToBeDeleted.push(user._id)
      }
    }

    for (let userId of usersToBeDeleted) {
      let user = await this.findUserById(userId)
      await mail.send(
        user,
        "Account deleted",
        "Tu cuenta ha sido eliminada por inactividad"
      )

      await this.deleteUserById(userId)
    }
  }

  async deleteUserById(id) {
    let user = await this.findUserById(id)

    await this.cartService.deleteCart(user.cart)

    await this.userDao.deleteUserById(id)
  }
}