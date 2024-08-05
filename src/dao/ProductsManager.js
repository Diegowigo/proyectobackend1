class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, stock) {
    let code = 1;
    if (this.products.length > 0) {
      code = this.products[this.products.length - 1].code + 1;
    }

    let existCode = this.products.find((product) => product.code === code);
    if (existCode) {
      console.log(`El producto de código ${code} ya está ingresado`);
      return;
    }

    let existTitle = this.products.find((product) => product.title === title);
    if (existTitle) {
      console.log(`El producto ya tiene título: ${title}`);
      return;
    }

    let existDescription = this.products.find(
      (product) => product.description === description
    );
    if (existDescription) {
      console.log(`El producto ya tiene descripción: ${description}`);
      return;
    }

    // let existPrice = this.products.find((product) => product.price === price);
    // if (existPrice) {
    //   console.log(`El producto ya tiene precio: ${price}`);
    //   return;
    // }

    let existThumbnail = this.products.find(
      (product) => product.thumbnail === thumbnail
    );
    if (existThumbnail) {
      console.log(`El producto ya tiene imagen: ${thumbnail}`);
      return;
    }

    //   let existStock = this.products.find((product) => product.stock === stock);
    //   if (existStock) {
    //     console.log(`El producto ya tiene stock: ${stock}`);
    //     return;
    //   }

    // validaciones
    this.products.push({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });
    console.log("Producto añadido (id, título):", code, title);
  }

  getProducts() {
    return this.products;
  }

  getProductById(code) {
    let product = this.products.find((product) => product.code === code);
    if (product) {
      console.log(product);
    } else {
      console.error("Not found");
    }
  }
}

const productManager = new ProductManager();

productManager.addProduct("Televisor", "Televisor Samsung", 750, "img1", 50);
productManager.addProduct("Celular", "Celular Samsung", 550, "img2", 20);
productManager.addProduct("Tablet", "Tablet Samsung", 250, "img3", 30);

console.log(productManager.getProducts());
console.log(productManager.getProductById(2));
