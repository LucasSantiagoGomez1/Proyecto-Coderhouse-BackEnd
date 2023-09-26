import chai from "chai";
import CartService from "../../src/services/cart.service.js";
import mongoose from "mongoose";

describe("Unit testing Carts", function() {

  this.timeout(10000)

  before(async function() {
    this.timeout(10000)

    this.connection = mongoose.connect('mongodb+srv://LucasGomez:Patabilla100@cluster0.c1sjpqg.mongodb.net/?retryWrites=true&w=majority');
    this.cartService = new CartService()

    console.log("Se ejecuta el before antes de los tests unitarios de carritos")
  })

  after(async function() {
    await mongoose.disconnect()
    console.log("Se cerro la conexion en Carts Test")
  })

  afterEach(async function() {
    for (let collection of this.collections) {
      await collection.deleteMany({})
    }
  })

  // Testeos Unitarios de los Carritos

  it('Al obtener los carritos, al principio es un array vacio', async function() {
    let carts = await this.cartService.getCarts()

    return chai.expect(carts).to.be.empty
  })

  it('Se crea un nuevo carrito', async function() {
    await this.cartService.createCart()

    let carts = await this.cartService.getCarts()

    return chai.expect(carts).to.have.length(1)
  })

  it('Se reemplazan todos los productos de un carrito', async function() {
    let cart = await this.cartService.createCart()

    let products = [
      {    
          product: "648e669847001ac4ac734ff8",
          quantity: 8
      },
      {
          product: "648e5e743d41e859947979fb",
          quantity: 12
      }
    ]

    await this.cartService.replaceProductsFromCart(cart._id, products)

    cart = await this.cartService.getCartById(cart._id)

    return chai.expect(cart.products).to.have.length(2)
  })

})