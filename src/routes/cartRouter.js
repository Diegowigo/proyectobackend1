import { Router } from "express";
// import CartManager from "../dao/CartManager.js";

export const router = Router();

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json();
});
