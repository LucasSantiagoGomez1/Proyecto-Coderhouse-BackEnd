import { Router } from "express"
import ProductManager from '../daos/mongodb/ProductManager.class.js'

let productManager = new ProductManager()

const router = Router()

router.get('/', async (req, res) => {
  let limit = Number(req.query.limit)
  let page = Number(req.query.limit)
  let sort = Number(req.query.sort)
  let filtro = req.query.filtro
  let filtroVal = req.query.filtroVal

  let products = await productManager.getProducts(limit, page, sort, filtro, filtroVal)

  let respuesta = {
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
  res.send(respuesta)
})

router.get('/:pid', async (req, res) => {
  let id = req.params.pid

  let product = await productManager.getProductById(id)

  if (!product) {
    res.send("No se encontró el producto")
    return
  }

  res.send(product) // Se envian los productos en forma de objeto como pide la consigna
})

router.post('/', async (req, res) => {
  try {
    let newProduct = req.body

    await productManager.addProduct(newProduct)
    
    const products = await productManager.getProducts()
    req.socketServer.sockets.emit('update-products', products) // Para que se actualicen los productos en tiempo real
  
    res.send({status: "success"})
  }
  catch(error) {
    res.status(400).send({status: "failure", details: error.message})
  }
})

router.put('/:pid', async (req, res) => {
  let id = req.params.pid
  let newProduct = req.body

  await productManager.updateProduct(id, newProduct)

  res.send({status: "success"})
})

router.delete('/:pid', async (req, res) => {
  let id = req.params.pid
  
  await productManager.deleteProduct(id)

  const products = await productManager.getProducts()
  req.socketServer.sockets.emit('update-products', products) // Para que se actualicen los productos en tiempo real

  res.send({status: "success"})
})

export default router