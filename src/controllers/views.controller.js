import ViewService from "../services/views.service.js";
import ViewUserDTO from "./DTO/viewUser.dto.js"

let viewService = new ViewService()

const home = async (req, res) => {
  let products = await viewService.getProducts();

  res.render('home', {
    title: "Inicio",
    products: products.docs
  });
}

const realTimeProducts = async (req, res) => {
  res.render('realTimeProducts');
}

const chat = async (req, res) => {
  res.render('chat')
}

const products = async (req, res) => {
  let user = req.user

  if (!user) {
    return res.redirect('/login')
  }

  let limit = req.query.limit
  let page = req.query.page
  let sort = req.query.sort

  let products = await viewService.getProducts(limit, page, sort); 

  products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}&limit=${limit}&sort=${sort}` : '';
  products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}&limit=${limit}&sort=${sort}` : '';

  res.render('products', {
    title: "Products",
    products: products,
    user: user
  })
}

const cart = async (req, res) => {
  try {
    let cartId = req.params.cid

    let cartProducts = await viewService.getAllProductsFromCart(cartId)
  
    res.render('cart', {
      title: "Cart",
      cartProducts: cartProducts,
      cartId: cartId
    })
  }
  catch (err) {
    return res.status(404).send({status: "error", error: err.message});
  }
}

const login = async (req, res) => {
  res.render('login')
}

const register = async (req, res) => {
  res.render('register')
}

const resetPassword = async (req, res) => {
  res.render('resetPassword');
}

const requestResetPassword = async (req, res) => {
  res.render('requestResetPassword')
}

const user = async (req, res, next) => {
  try {
    let userId = req.params.uid

    let user = await viewService.getUserById(userId)
  
    res.render('user', {
      title: "User",
      user: new ViewUserDTO(user),
      userId: userId
    })
  }
  catch (err) {
    return res.status(404).send({status: "error", error: err.message});
  }
}

const allUsers = async (req, res, next) => {
  try {
    let users = await viewService.getAllUsers()
  
    res.render('users', {
      title: "Users",
      users: users
    })
  }
  catch (err) {
    return res.status(404).send({status: "error", error: err.message});
  }
}

const ticket = async (req, res, next) => {
  try {
    let ticketId = req.params.tid

    let ticket = await viewService.getTicket(ticketId)

    let dataProductsBought = await viewService.getDataProductsBought(ticketId)

    res.render('ticket', {
      title: "Ticket",
      ticket: ticket,
      dataProductsBought: dataProductsBought
    })
  }
  catch (err) {
    return res.status(404).send({status: "error", error: err.message});
  }
}

export default {
  home,
  realTimeProducts,
  chat,
  products,
  cart,
  login,
  register,
  resetPassword,
  requestResetPassword,
  user,
  allUsers,
  ticket
}