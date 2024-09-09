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
      io.emit("productError", {
        icon: "error",
        title: "Error adding product",
        text: error.message,
      });
      console.error("Error adding product:", error.message);
    }
  });

  socket.on("deleteProduct", async (id) => {
    try {
      await ProductsManager.deleteProduct(id);
      io.emit("productDeleted", id);
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  });

  socket.on("updateProduct", async ({ id, updatedFields }) => {
    try {
      const updatedProduct = await ProductsManager.updateProduct(
        id,
        updatedFields
      );
      io.emit("productUpdated", updatedProduct);
    } catch (error) {
      io.emit("productError", {
        icon: "error",
        title: "Error updating product",
        text: error.message,
      });
      console.error("Error updating product:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});
