import ProductManager from '../daos/mongodb/managers/ProductManager.class.js'

let productManager = new ProductManager()

const getProducts = async (req, res) => {
  try {
    let limit = req.query.limit
    let page = req.query.page
    let sort = req.query.sort 
    let filter = req.query.filter
    let filterValue = req.query.filterValue

    let products = await productManager.getProducts(limit, page, sort, filter, filterValue)

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
    res.status(400).send({status: "error", details: "There was an error"})
  }
}

const getProductById = async (req, res) => {
  let id = req.params.pid

  let product = await productManager.getProductById(id)

  if (!product) {
    res.send("No se encontró el producto")
    return
  }

  res.send(product)
}

const addProduct = async (req, res) => {
  try {
    let newProduct = req.body

    await productManager.addProduct(newProduct)
    
    const products = await productManager.getProducts()
    req.socketServer.sockets.emit('update-products', products)
  
    res.send({status: "success"})
  }
  catch(error) {
    res.status(400).send({status: "failure", details: error.message})
  }
}

const updateProduct = async (req, res) => {
  let id = req.params.pid
  let newProduct = req.body

  await productManager.updateProduct(id, newProduct)

  res.send({status: "success"})
}

const deleteProduct = async (req, res) => {
  let id = req.params.pid
  
  await productManager.deleteProduct(id)

  const products = await productManager.getProducts()
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