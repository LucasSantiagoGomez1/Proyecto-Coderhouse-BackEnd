import mongoose from "mongoose";
import { productsModel } from './models/products.model.js'

export default class ProductManager {
  connection = mongoose.connect('mongodb+srv://LucasGomez:Patabilla100@cluster0.c1sjpqg.mongodb.net/?retryWrites=true&w=majority')

  async addProduct(product) {
    try {
      let result = await productsModel.create(product)
      return result
    }
    catch(error) {
      throw new Error("Product code is duplicated")
    }
  }

  async getProducts(limit = 10, page = 1, sort = 0, filtro = null, filtroVal = null) {
    let whereOptions = {}
    if(filtro != "" && filtroVal != ""){
      whereOptions = {[filtro] : filtroVal }
    }
    let result = await productsModel.paginate(whereOptions, {
        limit: limit, 
        page: page, 
        sort: {price: sort}}
      )
    return result
  }

  async getProductById(id) {
    let result = await productsModel.findOne({ _id: id })
    return result
  }

  async updateProduct(id, updatedProduct) {
    let result = await productsModel.updateOne({ _id: id}, { $set: updatedProduct })
    return result
  }

  async deleteProduct(id) {
    let result = await productsModel.deleteOne({ _id: id })
    return result
  }
}