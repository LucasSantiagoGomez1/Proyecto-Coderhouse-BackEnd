import ProductService from "./products.service.js";
import CartService from "../services/cart.service.js";
import UserService from "../services/user.service.js"
import TicketService from "./ticket.service.js";

export default class ViewService {

  constructor() {
    this.productService = new ProductService()
    this.cartService = new CartService()
    this.userService = new UserService()
    this.ticketService = new TicketService()
  }

  async getProducts(limit, page, sort, filter, filterValue) {
    let products = await this.productService.getProducts(limit, page, sort, filter, filterValue)

    return products
  }

  async getAllProductsFromCart(cartId) {
    let products = await this.cartService.getAllProductsFromCart(cartId)

    return products
  }

  async getUserById(userId) {
    let user = await this.userService.findUserById(userId)

    return user.toObject()
  }

  async getAllUsers() {
    let users = await this.userService.getAllUsers()
    
    users = users.map((user) => user.toObject())

    return users
  }

  async getTicket(ticketId) {
    let ticket = await this.ticketService.getTicketById(ticketId)

    return ticket.toObject()
  }

  async getDataProductsBought(ticketId) {
    let ticket = await this.ticketService.getTicketById(ticketId)
    
    let productsBought = []

    for (let product of ticket.products) {
      let fullProduct = await this.productService.getProductById(product.productId)

      productsBought.push({
        product: fullProduct.toObject(),
        quantity: product.quantity,
        subtotal: product.quantity * fullProduct.price
      })
    }
    
    return productsBought
  }
}