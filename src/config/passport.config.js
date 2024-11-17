import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import passportJWT from "passport-jwt";
import { UsersManager } from "../dao/UsersManager.js";
import { generateHash, validateHash } from "../utils.js";
import config from "./config.js";

const searchToken = (req) => {
  let token = null;

  if (req.cookies.currentUser) {
    token = req.cookies.currentUser;
  }

  return token;
};

export const initPassport = () => {
  passport.use(
    "register",
    new local.Strategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          let { first_name, last_name, role, age, cart } = req.body;
          if (!first_name) {
            return done(null, false);
          }
          if (!last_name) {
            return done(null, false);
          }
          if (role) {
            role = role.toLowerCase();
            if (role !== "admin" && role !== "user") {
              return done(null, false, {
                message: "Solo se admite rol admin o user",
              });
            }
          }
          if (!age) {
            return done(null, false);
          }
          let exist = await UsersManager.getBy({ email: username });
          if (exist) {
            console.log(exist);
            return done(null, false, {
              message: `El usuario ${username} ya existe en la base de datos`,
            });
          }

          password = generateHash(password);

          let newUser = await UsersManager.addUser({
            first_name,
            last_name,
            email: username,
            age,
            password,
            cart,
          });
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          let user = await UsersManager.getBy({ email: username });
          if (!user) {
            return done(null, false, { message: "Credenciales invalidas" });
          }
          if (!validateHash(password, user.password)) {
            return done(null, false, { message: "Credenciales invalidas" });
          }
          delete user.password;
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new passportJWT.Strategy(
      {
        secretOrKey: config.SECRET,
        jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([
          searchToken,
        ]),
      },
      async (user, done) => {
        try {
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: "Iv23liFQjA98qyrG5OQ7",
        clientSecret: "e690cbe4f547df09fef1c0d5158b56220991fbaa",
        callbackURL: "http://localhost:8080/api/sessions/callbackGithub",
      },
      async (token, rt, profile, done) => {
        try {
          let { name, email } = profile._json;
          if (!name || !email) {
            return done(null, false);
          }
          let user = await UsersManager.getUserBy({ email });
          if (!user) {
            usuario = await UsersManager.addUser({
              first_name: name,
              email,
              profileGithub: profile,
            });
          }
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
