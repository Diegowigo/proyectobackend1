class ProductManager {
  constructor(productsData) {
    this.path = productsData;
  }

  async getProducts() {
    if (fs.existsSync(this.path)) {
      return JSON.parse(
        await fs.promises.readFile(this.path, { encoding: "utf-8" })
      );
    } else {
      return [];
    }
  }

  async addProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  ) {
    let products = this.getProducts();

    let id = 1;
    if (this.products.length > 0) {
      id = this.products[this.products.length - 1].id + 1;
    }

    // validaciones
    let existCode = this.products.find((product) => product.code === code);
    if (existCode) {
      console.log(`El producto de código ${code} ya está ingresado`);
      return;
    }

    products.push({
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products, null, 2)
    );
    console.log(`Producto añadido con id: ${id} y título: ${title}`);
  }

  // let existTitle = this.products.find((product) => product.title === title);
  // if (existTitle) {
  //   console.log(`El producto ya tiene título: ${title}`);
  //   return;
  // }

  // let existDescription = this.products.find(
  //   (product) => product.description === description
  // );
  // if (existDescription) {
  //   console.log(`El producto ya tiene descripción: ${description}`);
  //   return;
  // }

  // let existPrice = this.products.find((product) => product.price === price);
  // if (existPrice) {
  //   console.log(`El producto ya tiene precio: ${price}`);
  //   return;
  // }

  // let existThumbnail = this.products.find(
  //   (product) => product.thumbnail === thumbnail
  // );
  // if (existThumbnail) {
  //   console.log(`El producto ya tiene imagen: ${thumbnail}`);
  //   return;
  // }

  //   let existStock = this.products.find((product) => product.stock === stock);
  //   if (existStock) {
  //     console.log(`El producto ya tiene stock: ${stock}`);
  //     return;
  //   }
  // }

  getProducts() {
    return this.products;
  }

  getProductById(code) {
    let product = this.products.find((product) => product.code === code);
    if (product) {
      console.log(product);
    } else {
      console.error("Product not found");
    }
  }
}

const productManager = new ProductManager("../data/products.js");

const app = async () => {
  productManager.addProduct("Televisor", "Televisor Samsung", 750, "img1", 50);
  productManager.addProduct("Celular", "Celular Samsung", 550, "img2", 20);
  productManager.addProduct("Tablet", "Tablet Samsung", 250, "img3", 30);

  console.log(productManager.getProducts());
  console.log(productManager.getProductById(2));
};

app();
