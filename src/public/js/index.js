const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  const ulProducts = document.getElementById("product-list");
  const paginationDiv = document.getElementById("pagination");

  const getProducts = async () => {
    let params = new URLSearchParams(location.search);
    let page = params.get("page") || 1;

    let res = await fetch(`/api/products?page=${page}`);
    let data = await res.json();

    ulProducts.innerHTML = "";

    data.docs.forEach((u) => {
      let liProduct = document.createElement("li");
      liProduct.innerHTML = `
        <strong>Código:</strong> ${u.code} <br>
        <strong>Título:</strong> ${u.title} <br>
        <strong>Descripción:</strong> ${u.description} <br>
        <strong>Precio:</strong> $${u.price} <br>
        <button class="add-to-cart" data-product-id="${u._id}">Agregar al carrito</button>
        <hr>
      `;
      ulProducts.append(liProduct);
    });

    paginationDiv.innerHTML = "";

    if (data.hasPrevPage) {
      const toPrevPage = document.createElement("a");
      toPrevPage.textContent = `Página Anterior`;
      toPrevPage.href = `/products?page=${data.prevPage}`;
      paginationDiv.append(toPrevPage);
    }

    const currentPage = document.createElement("span");
    currentPage.textContent = `Página ${data.page} de ${data.totalPages}`;
    paginationDiv.append(currentPage);

    if (data.hasNextPage) {
      const toNextPage = document.createElement("a");
      toNextPage.textContent = `Página Siguiente`;
      toNextPage.href = `/products?page=${data.nextPage}`;
      paginationDiv.append(toNextPage);
    }

    const toFirstPage = document.createElement("a");
    toFirstPage.textContent = `Primera Página`;
    toFirstPage.href = `/products?page=1`;
    paginationDiv.prepend(toFirstPage);

    const toLastPage = document.createElement("a");
    toLastPage.textContent = `Última Página`;
    toLastPage.href = `/products?page=${data.totalPages}`;
    paginationDiv.append(toLastPage);
  };

  ulProducts.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart")) {
      const productId = event.target.getAttribute("data-product-id");
      addToCart(productId);
    }
  });

  getProducts();
});

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
      .querySelector(".title")
      .innerText.replace("Título:", "")
      .trim();
    const description = productItem
      .querySelector(".description")
      .innerText.replace("Descripción:", "")
      .trim();
    const code = productItem
      .querySelector(".code")
      .innerText.replace("Código de Producto:", "")
      .trim();
    const price = productItem
      .querySelector(".price")
      .innerText.replace("Precio:", "")
      .replace("$", "")
      .trim();
    const stock = productItem
      .querySelector(".stock")
      .innerText.replace("Stock:", "")
      .trim();
    const category = productItem
      .querySelector(".category")
      .innerText.replace("Categoría:", "")
      .trim();

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
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Product ID not provided.",
      });
      return;
    }
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

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};

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
        <strong class="title">Título:</strong> ${product.title} <br>
        <strong class="description">Descripción:</strong> ${product.description} <br>
        <strong class="code">Código de Producto:</strong> ${product.code} <br>
        <strong class="price">Precio:</strong> $${product.price} <br>
        <strong class="stock">Stock:</strong> ${product.stock} <br>
        <strong class="category">Categoría:</strong> ${product.category} <br>
        <button onclick="editProduct('${product.id}')">Editar Producto</button>
        <button onclick="deleteProduct('${product.id}')">Eliminar</button>
      </li>
      <hr>
    `;
    productList.innerHTML += productItem;
  }
});

socket.on("productDeleted", (id) => {
  const productItem = document.getElementById(`product-${id}`);
  if (productItem) {
    productItem.remove();
  }
});
