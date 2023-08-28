import ProductService from '../services/products.service.js'

let productService = new ProductService

const getProducts = async (req, res, next) => {
  try {
    let limit = req.query.limit
    let page = req.query.page
    let sort = req.query.sort
    let filter = req.query.filter
    let filterValue = req.query.filterValue

    let products = await productService.getProducts(limit, page, sort, filter, filterValue)

    let response = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.prevLink,
      nextLink: products.nextLink
    }

    res.send(response)
  }
  catch (error) {
    return next(error)
  }
}

const getProductById = async (req, res, next) => {
  try {
    let id = req.params.pid

    let product = await productService.getProductById(id)

    res.send(product)
  }
  catch(error) {
    return next(error)
  }
}

const addProduct = async (req, res, next) => {
  try {
    let newProduct = req.body

    await productService.addProduct(newProduct)
    
    const products = await productService.getProducts()
    req.socketServer.sockets.emit('update-products', products)
  
    res.send({status: "success"})
  }
  catch(error) {
    return next(error)
  }
}

const updateProduct = async (req, res) => {
  let id = req.params.pid
  let newProduct = req.body

  await productService.updateProduct(id, newProduct)

  res.send({status: "success"})
}

const deleteProduct = async (req, res) => {
  let id = req.params.pid
  
  await productService.deleteProduct(id)

  const products = await productService.getProducts()
  req.socketServer.sockets.emit('update-products', products)

  res.send({status: "success"})
}

export default {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
}