import { Router } from "express";
import UserManager from "../daos/mongodb/UserManager.class.js";
import { createHash } from "../utils.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const userManager = new UserManager()

const router = Router()

router.post('/register', passport.authenticate('register', {failureRedirect: 'api/sessions/registerFail'}), async (req, res) => {
  res.send({ status: "success", message: "User has been created"});
})

router.get('/registerFail', async (req, res) => {
  res.status(400).send({status: "error", error: "Authentication failed"})
})

router.post('/login', passport.authenticate('login', {session: false, failureRedirect: 'api/sessions/loginFail'}), async (req, res) => {
  let user = req.user
  
  if (!user) {
    return res.status(400).send({status: "error", details: "Invalid credentials"})
  }

  let token = jwt.sign(req.user, 'coderSecret', {expiresIn: '24h'})

  return res.cookie("authToken", token, {httpOnly: true}).send({status: "success"})
})

router.get('/loginFail', async (req, res) => {
  res.status(400).send({status:"error", details: "Login failed"});
})

router.post('/logout', async (req, res) => {
  res.clearCookie('authToken')
  res.send({status: "sucess"})
})

router.post('/resetPassword', async (req, res) => {
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
})

// github routes

router.get("/github", passport.authenticate("github", { scope: "user:email" }), async (req, res) => {


});

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login', session: false}), async (req, res) => {

  const user = {
    name: `${req.user.first_name} ${req.user.last_name}`,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
    id: req.user._id,
    cart: req.user.cart
  }

  let token = jwt.sign(user, 'coderSecret', {expiresIn: '24h'})

  return res.cookie("authToken", token, {httpOnly: true}).redirect('/products')
});

// current

router.get("/current", passport.authenticate("jwt", { session: false }), async (req, res) => {
  res.send(req.user);
});

export default router