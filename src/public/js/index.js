const socket = io();

const form = document.getElementById("productForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const product = {
      title: form.title.value,
      description: form.description.value,
      code: form.code.value,
      price: form.price.value,
      stock: form.stock.value,
      category: form.category.value,
    };
    socket.emit("newProduct", product);
  });
}

socket.on("productAdded", (product) => {
  const productList = document.getElementById("productList");
  if (productList) {
    const productItem = `
      <li id="product-${product.id}">
        <strong>Título:</strong> ${product.title} <br>
        <strong>Descripción:</strong> ${product.description} <br>
        <strong>Código de Producto:</strong> ${product.code} <br>
        <strong>Precio:</strong> $${product.price} <br>
        <strong>Stock:</strong> ${product.stock} <br>
        <strong>Categoría:</strong> ${product.category} <br>
        <button onclick="deleteProduct('${product.id}')">Eliminar</button>
      </li>
      <hr>
    `;
    productList.innerHTML += productItem;
  }
});

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};

socket.on("productDeleted", (id) => {
  console.log("Deleting product with ID:", id);
  const product = document.getElementById(`product-${id}`);
  if (product) {
    product.remove();
  }
});

// terminar updatre product frontend
const updateProduct = (id) => {
  socket.emit("updateProduct", id);
};

socket.on("productUpdated", (id) => {
  console.log("Product updated with ID:", id);
  const product = document.getElementById(`product-${id}`);
  if (product) {
    // product.remove();
  }
});
