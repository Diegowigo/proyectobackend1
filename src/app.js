import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import ProductsManager from "./dao/ProductsManager.js";

import { router as productsRouter } from "./routes/productsRouter.js";
import { router as cartsRouter } from "./routes/cartsRouter.js";
import { router as viewsRouter } from "./routes/viewsRouter.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const server = app.listen(PORT, () => {
  console.log(`Server escuchando el puerto ${PORT}`);
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("newProduct", async (product) => {
    try {
      const addedProduct = await ProductsManager.addProduct(product);
      io.emit("productAdded", addedProduct);
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});
