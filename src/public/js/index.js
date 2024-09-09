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

const editProduct = (id) => {
  // Muestra el formulario de edición
  const editFormContainer = document.getElementById("editFormContainer");
  const editProductId = document.getElementById("editProductId");
  const editTitle = document.getElementById("editTitle");
  const editDescription = document.getElementById("editDescription");
  const editCode = document.getElementById("editCode");
  const editPrice = document.getElementById("editPrice");
  const editStock = document.getElementById("editStock");
  const editCategory = document.getElementById("editCategory");

  // Llena el formulario con los datos actuales del producto
  const product = document.getElementById(`product-${id}`);
  if (product) {
    editProductId.value = id;
    editTitle.value = product
      .querySelector("strong:nth-of-type(1)")
      .innerText.split(": ")[1];
    editDescription.value = product
      .querySelector("strong:nth-of-type(2)")
      .innerText.split(": ")[1];
    editCode.value = product
      .querySelector("strong:nth-of-type(3)")
      .innerText.split(": ")[1];
    editPrice.value = product
      .querySelector("strong:nth-of-type(4)")
      .innerText.split(": ")[1];
    editStock.value = product
      .querySelector("strong:nth-of-type(5)")
      .innerText.split(": ")[1];
    editCategory.value = product
      .querySelector("strong:nth-of-type(6)")
      .innerText.split(": ")[1];

    editFormContainer.style.display = "block";
  }
};

// Función para cancelar la edición
const cancelEdit = () => {
  // Oculta el formulario de edición
  const editFormContainer = document.getElementById("editFormContainer");
  editFormContainer.style.display = "none";
};

// Manejar el envío del formulario de edición
const editForm = document.getElementById("editProductForm");
if (editForm) {
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("editProductId").value;
    const updatedProduct = {
      title: editForm.title.value,
      description: editForm.description.value,
      code: editForm.code.value,
      price: editForm.price.value,
      stock: editForm.stock.value,
      category: editForm.category.value,
    };
    socket.emit("updateProduct", { id, updatedFields: updatedProduct });
  });
}

socket.on("productUpdated", (product) => {
  const productItem = document.getElementById(`product-${product.id}`);
  if (productItem) {
    productItem.innerHTML = `
      <strong class="title">Título:</strong> ${product.title} <br>
      <strong class="description">Descripción:</strong> ${product.description} <br>
      <strong class="code">Código de Producto:</strong> ${product.code} <br>
      <strong class="price">Precio:</strong> $${product.price} <br>
      <strong class="stock">Stock:</strong> ${product.stock} <br>
      <strong class="category">Categoría:</strong> ${product.category} <br>
      <button onclick="editProduct('${product.id}')">Editar Producto</button>
      <button onclick="deleteProduct('${product.id}')">Eliminar</button>
    `;
  }
});

socket.on("productError", (data) => {
  Swal.fire({
    icon: data.icon,
    title: data.title,
    text: data.text,
  });
});

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
        <button onclick="updateProduct"('${product.id}')>Editar Producto</button>
        <button onclick="deleteProduct"('${product.id}')>Eliminar</button>
      </li>
      <hr>
    `;
    productList.innerHTML += productItem;
  }
});

socket.on("productError", (data) => {
  Swal.fire({
    icon: data.icon,
    title: data.title,
    text: data.text,
  });
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
