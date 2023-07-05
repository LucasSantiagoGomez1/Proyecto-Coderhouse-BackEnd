import { Router } from 'express';
import ProductManager from '../daos/mongodb/ProductManager.class.js';
import CartManager from '../daos/mongodb/CartManager.class.js'

let productManager = new ProductManager()
let cartManager = new CartManager()

const router = Router();

router.get('/', async (req, res) => {
  let products = await productManager.getProducts();
  res.render('home', {
    title: "Inicio",
    products: products
  });
})

router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts');
})

router.get('/chat', async (req, res) => {
  res.render('chat')
})

router.get('/products', async (req, res) => {
  let limit = req.query.limit
  let page = req.query.page

  let products = await productManager.getProducts(limit, page); 

  products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}&limit=${limit}` : '';
  products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}&limit=${limit}` : '';

  res.render('products', {
    title: "Products",
    products: products
  })
})

router.get('/carts/:cid', async (req, res) => {
  let cartId = req.params.cid

  let cartProducts = await cartManager.getAllProductsFromCart(cartId)

  res.render('cart', {
    title: "Cart",
    cartProducts: cartProducts,
    cartId: cartId
  })
})


export default router;