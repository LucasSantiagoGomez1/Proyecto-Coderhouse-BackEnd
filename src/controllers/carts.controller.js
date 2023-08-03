import CartManager from "../daos/mongodb/managers/CartManager.class.js";

let cartManager = new CartManager()

const getCarts = async (req, res) => {
  let carts = await cartManager.getCarts()

  res.send(carts)
}

const getCartById = async (req, res) => {
  let id = req.params.cid

  let cart = await cartManager.getCartById(id)

  if (!cart) {
    res.send("No se encontró el carrito")
    return
  }

  res.send(cart.products)
}

const createCart = async (req, res) => {
  await cartManager.createCart()

  res.send({status: "success"})
}

const addProductToCart = async (req, res) => {
  try {
    let cartId = req.params.cid
    let productId = req.params.pid

    await cartManager.addProductToCart(cartId, productId)

    res.send({status: "success"})
  }
  catch(error) {
    res.status(400).send({status: "failure", details: error.message})
  }
}

const deleteProductFromCart = async (req, res) => {
  try {
    let cartId = req.params.cid
    let productId = req.params.pid

    await cartManager.deleteProductFromCart(cartId, productId)

    res.send({status: "success"})
  }
  catch(error) {
    res.status(400).send({status: "failure", details: error.message})
  }
}

const deleteAllProductsFromCart = async (req, res) => {
  let cartId = req.params.cid

  await cartManager.deleteAllProductsFromCart(cartId)

  res.send({status: "success"})
}

const replaceProductsFromCart = async (req, res) => {
  let cartId = req.params.cid
  let newProducts = req.body

  await cartManager.replaceProductsFromCart(cartId, newProducts)

  res.send({status: "success"})
}

const updateProductQuantityFromCart = async (req, res) => {
  let cartId = req.params.cid
  let productId = req.params.pid
  let newQuantity = req.body.quantity

  await cartManager.updateProductQuantityFromCart(cartId, productId, newQuantity)

  res.send({status: "success"})
}

export default {
  getCarts,
  getCartById,
  createCart,
  addProductToCart,
  deleteProductFromCart,
  deleteAllProductsFromCart,
  replaceProductsFromCart,
  updateProductQuantityFromCart
}