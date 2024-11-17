import { Router } from "express";
import passport from "passport";
import { SessionsController } from "../controllers/SessionsController.js";

export const router = Router();

router.get("/error", SessionsController.error);

router.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/sessions/error",
  }),
  SessionsController.register
);

router.post(
  "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/api/sessions/error",
  }),
  SessionsController.login
);

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  SessionsController.current
);

router.get("/github", passport.authenticate("github", {}));

router.get(
  "/callbackGithub",
  passport.authenticate("github", { failureRedirect: "/api/sessions/error" }),
  SessionsController.callBackGithub
);
