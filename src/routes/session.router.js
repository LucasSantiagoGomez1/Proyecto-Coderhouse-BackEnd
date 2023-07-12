import { Router } from "express";
import UserManager from "../daos/mongodb/UserManager.class.js";

const userManager = new UserManager()

const router = Router()

router.post("/register", async (req, res) => {
  try {
    let userData = req.body
    
    await userManager.addUser(userData)

    res.send({status: "sucess"})
  }
  catch(error) {
    res.status(400).send({status: "error", details: error.message})
  }
})

router.post("/login", async (req, res) => {
  let { email, password } = req.body

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.user = {
      name: "Admin",
      email: "adminCoder@coder.com",
      role: "admin"
    }

    return res.send({status: "success", user: req.session.user})
  }

  let user = await userManager.findUser(email, password)

  if (!user) {
    return res.status(400).send({status: "error", details: "User can't be found"})
  }

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: "user"
  }

  res.send({status: "success", user: req.session.user})
})

router.post('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).send({status: "error", details: "The session couldn't be destroyed"})
    }

    res.clearCookie('connect.sid')
    res.send({status: "sucess"})
  })
})

export default router