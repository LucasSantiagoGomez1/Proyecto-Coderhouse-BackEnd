import { Router } from 'express';
import ProductManager from '../daos/mongodb/ProductManager.class.js';
import CartManager from '../daos/mongodb/CartManager.class.js'
import passport from 'passport';

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

router.get('/products', passport.authenticate("jwt", { session: false }), async (req, res) => {
  let user = req.user

  if (!user) {
    return res.redirect('/login')
  }

  let limit = req.query.limit
  let page = req.query.page
  let sort = req.query.sort

  let products = await productManager.getProducts(limit, page, sort); 

  products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}&limit=${limit}&sort=${sort}` : '';
  products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}&limit=${limit}&sort=${sort}` : '';

  res.render('products', {
    title: "Products",
    products: products,
    user: user
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

router.get('/login', async (req, res) => {
  res.render('login')
})

router.get('/register', async (req, res) => {
  res.render('register')
})

router.get('/resetPassword', async (req, res)=>{
  res.render('resetPassword');
})


export default router;