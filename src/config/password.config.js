import passport from "passport";
import LocalStrategy from "passport-local";
import GithubStrategy from 'passport-github2'

import { createHash, validatePassword } from "../utils.js";
import UserManager from "../daos/mongodb/UserManager.class.js";

const userManager = new UserManager()

const initializePassport = () => {

  // Strategies

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.823ba34d6adb9982",
        clientSecret: "a773f57af117d7b576dabde84df9814389affb1d",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        let user = await userManager.findUser(profile._json.email);
        
        if (!user) {
          let newUser = {
            // Github no nos da "last_name, age, y password" (por ello se hardcodean los datos)
            first_name: profile._json.name,
            last_name: "test-lastname", 
            email: profile._json.email,
            age: 22,
            password: ''
          };

          const result = await userManager.addUser(newUser);

          done(null, result);
        } 
        else {
          done(null, false); // Quiza deberia mandar el user (el profe no lo hizo, lo dejo asi)
        }
      }
    )
  );  

  passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      let user = {
        name: "Admin",
        email: "adminCoder@coder.com",
        age: "None",
        role: "admin",
        id: 0
      }

      return done(null, user)
    }

    let user = await userManager.findUser(email)

    if (!user) {
      return done(null, false)
    }

    // Ya encontramos al usuario. Validamos y enviamos

    const isValidPassword = await validatePassword(password, user); // Se valida la contrasenia
    
    if (!isValidPassword) {
      return done(null, false)
    } 

    user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: "user",
      id: user._id
    }

    return done(null, user);
  }));

  passport.use("register", new LocalStrategy(
    {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
      const {first_name, last_name, email, age} = req.body;

      try {
        let user = await userManager.findUser(email); // Podria usar "username", pero es lo mismo

        if (user) {
          // console.log("User alredy exists");
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
        return done("Error getting user" + error.message);
      }
  }));

  // Serialization

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    if (id === 0) {
      return done(null, {name: "Admin", role: "admin"})
    }

    let user = await userManager.findUserById(id);
    done(null, user);
  });
};

export default initializePassport;