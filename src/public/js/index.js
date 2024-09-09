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
  const editFormContainer = document.getElementById("editFormContainer");
  editFormContainer.style.display = "block";

  const productItem = document.getElementById(`product-${id}`);
  if (productItem) {
    const title = productItem
      .querySelector("strong:nth-of-type(1)")
      .nextSibling.nodeValue.trim();
    const description = productItem
      .querySelector("strong:nth-of-type(2)")
      .nextSibling.nodeValue.trim();
    const code = productItem
      .querySelector("strong:nth-of-type(3)")
      .nextSibling.nodeValue.trim();
    const price = productItem
      .querySelector("strong:nth-of-type(4)")
      .nextSibling.nodeValue.trim()
      .replace("$", "");
    const stock = productItem
      .querySelector("strong:nth-of-type(5)")
      .nextSibling.nodeValue.trim();
    const category = productItem
      .querySelector("strong:nth-of-type(6)")
      .nextSibling.nodeValue.trim();

    document.getElementById("editProductId").value = id;
    document.getElementById("editTitle").value = title;
    document.getElementById("editDescription").value = description;
    document.getElementById("editCode").value = code;
    document.getElementById("editPrice").value = price;
    document.getElementById("editStock").value = stock;
    document.getElementById("editCategory").value = category;
  }
};

const cancelEdit = () => {
  document.getElementById("editFormContainer").style.display = "none";
};

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
        <button onclick="editProduct"('${product.id}')>Editar Producto</button>
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
  const productItem = document.getElementById(`product-${id}`);
  if (productItem) {
    productItem.remove();
  }
});
