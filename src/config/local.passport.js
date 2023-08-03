import passport from "passport";
import LocalStrategy from "passport-local";

import { createHash, validatePassword } from "../utils.js";
import UserManager from "../daos/mongodb/managers/UserManager.class.js";

import config from "../config.js";

const userManager = new UserManager()

const initializePassportLocal = () => {

  // Strategies

  passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    if (email === config.ADMIN_NAME && password === config.ADMIN_PASSWORD) {
      let user = {
        name: "Admin",
        email: config.ADMIN_NAME,
        age: "None",
        role: "admin",
        id: 0,
        cart: '6497212e45dc4c65b0998622'
      }

      return done(null, user)
    }

    let user = await userManager.findUser(email)

    if (!user) {
      return done(null, false)
    }

    const isValidPassword = await validatePassword(password, user);
    
    if (!isValidPassword) {
      return done(null, false)
    } 

    user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
      id: user._id,
      cart: user.cart
    }

    return done(null, user);
  }));

  passport.use("register", new LocalStrategy(
    {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
      const {first_name, last_name, email, age} = req.body;

      try {
        let user = await userManager.findUser(email); // Podria usar "username", pero es lo mismo

        if (user) {
          return done(null, false); // Quiza mandar error en vez de null
        }

        let newUser = {
          first_name,
          last_name,
          email,
          age,
          password: createHash(password)
        };

        let result = await userManager.addUser(newUser);

        return done(null, result);
      }
      catch(error) {
        return done("Error at user signup" + error);
      }
  }));
};

export default initializePassportLocal;