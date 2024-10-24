import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
export const router = Router();

router.get("/error", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(401).json({ error: `Error al autenticar` });
});

router.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/sessions/error",
  }),
  (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json({
      payload: `Registro exitoso para ${req.user.first_name}`,
      user: req.user,
    });
  }
);

router.post(
  "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/api/sessions/error",
  }),
  (req, res) => {
    let token = jwt.sign(req.user, config.SECRET, { expiresIn: 3600 });

    res.cookie("currentUser", token, { httpOnly: true });
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json({
      payload: `Login exitoso para ${req.user.first_name}`,
      userLoggedIn: req.user,
    });
  }
);

router.get(
  "/current",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/api/sessions/error",
  }),
  (req, res) => {
    let token = jwt.sign(req.user, config.SECRET, { expiresIn: 3600 });

    res.cookie("currentUser", token, { httpOnly: true });
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json({
      payload: `Login exitoso para ${req.user.first_name}`,
      userLoggedIn: req.user,
    });
  }
);

router.get("/github", passport.authenticate("github", {}));

router.get(
  "/callbackGithub",
  passport.authenticate("github", { failureRedirect: "/api/sessions/error" }),
  (req, res) => {
    const token = jwt.sign({ user: req.user }, config.SECRET, {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      payload: "Login exitoso",
      userLoggedIn: req.user,
    });
  }
);
