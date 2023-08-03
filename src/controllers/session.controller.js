import UserManager from "../daos/mongodb/managers/UserManager.class.js";
import { createHash } from "../utils.js";
import jwt from "jsonwebtoken";
import config from "../config.js";

const userManager = new UserManager()

const register = async (req, res) => {
  res.send({ status: "success", message: "User has been created"});
}

const registerFail = async (req, res) => {
  res.status(400).send({status: "error", error: "Authentication failed"})
}

const login = async (req, res) => {
  let user = req.user
  
  if (!user) {
    return res.status(400).send({status: "error", details: "Invalid credentials"})
  }

  let token = jwt.sign(req.user, 'coderSecret', {expiresIn: '24h'})

  return res.cookie("authToken", token, {httpOnly: true}).send({status: "success"})
}

const loginFail = async (req, res) => {
  res.status(400).send({status:"error", details: "Login failed"});
}

const logout = async (req, res) => {
  res.clearCookie('authToken')
  res.send({status: "sucess"})
}

const resetPassword = async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).send({status: "error", error: "Incomplete values"});
  }

  try {
    const newHashedPassword = createHash(password);

    await userManager.updatePassword(email, newHashedPassword)

    return res.send({status: "success", message: "Password updated"});
  }
  catch(error) {
    return res.status(404).send({status: "error", error: error.message});
  }
}

const github = async (req, res) => {


}

const githubcallback = async (req, res) => {
  const user = {
    name: `${req.user.first_name} ${req.user.last_name}`,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
    id: req.user._id,
    cart: req.user.cart
  }

  let token = jwt.sign(user, config.JWT_SECRET, {expiresIn: '24h'})

  return res.cookie("authToken", token, {httpOnly: true}).redirect('/products')
}

const current = async (req, res) => {
  res.send(req.user);
}

export default {
  register,
  registerFail,
  login,
  loginFail,
  logout,
  resetPassword,
  github,
  githubcallback,
  current
}