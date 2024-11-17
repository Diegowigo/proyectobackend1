import { Router } from "express";
import { ViewsController } from "../controllers/ViewsController.js";

export const router = Router();

router.get("/products", ViewsController.products);

router.get("/realtimeproducts", ViewsController.realtimeproducts);

router.get("/carts/:cid", ViewsController.carts);
