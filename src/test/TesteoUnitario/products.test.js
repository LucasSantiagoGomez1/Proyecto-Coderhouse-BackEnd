import chai from "chai";
import ProductService from "../../src/services/products.service.js";
import mongoose from "mongoose";

this.connection = mongoose.connect('mongodb+srv://LucasGomez:Patabilla100@cluster0.c1sjpqg.mongodb.net/?retryWrites=true&w=majority');

describe("Unit Testing Products", function() {

  this.timeout(10000)

  before(async function() {
    this.timeout(10000)

    await mongoose.connection.collections.products.drop()
    this.productService = new ProductService()

    console.log("Se ejecuta el before antes de los tests unitarios de productos")
  })

  after(async function() {
    await mongoose.disconnect()
    console.log("Se cerro la conexion en Products Test")
  })

  // Testeos unitarios de los Productos

  it('Al obtener los productos, existe un atributo docs, y es un array vacio', async function() {
    let products = await this.productService.getProducts()

    return chai.expect(products).to.have.property('docs').and.to.be.empty
  })

  it('Se agrega un producto a la base de datos', async function() {
    let mockProduct = {
      title: "Limón",
      description: "Soy un limón",
      price: 38,
      thumbnails: [
        'limon_img'
      ],
      code: 1,
      stock: 7,
      category: "Frutas",
      status: true
    }

    await this.productService.addProduct(mockProduct)

    let products = await this.productService.getProducts()

    return chai.expect(products).to.have.property('docs').and.to.have.length(1)
  })

  it('Se agrega un producto y se modifica su stock', async function() {
    let mockProduct = {
      title: "Limón",
      description: "Soy un limón",
      price: 38,
      thumbnails: [
        'limon_img'
      ],
      code: 1,
      stock: 7,
      category: "Frutas",
      status: true
    }

    await this.productService.addProduct(mockProduct)

    let product = await this.productService.getProductByCode(1)

    chai.expect(product).to.have.property("stock").and.to.be.equal(7)

    await this.productService.updateProduct(product._id, {stock: 91})

    product = await this.productService.getProductByCode(1)

    return chai.expect(product).to.have.property("stock").and.to.be.equal(91)
  })
})