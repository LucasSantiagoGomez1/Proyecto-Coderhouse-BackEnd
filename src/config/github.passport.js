import passport from "passport";
import GithubStrategy from 'passport-github2'
import config from "../config.js";

import UserManager from "../daos/mongodb/managers/UserManager.class.js";

const userManager = new UserManager()

const initializePassportGithub = () => {

  // Strategies

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        let user = await userManager.findUser(profile._json.email);
        
        if (!user) {
          let newUser = {
            // Github no nos da "last_name", "age", y "password" (por ello se hardcodean los datos)
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
          done(null, user);
        }
      }
    )
  );  
};

export default initializePassportGithub;