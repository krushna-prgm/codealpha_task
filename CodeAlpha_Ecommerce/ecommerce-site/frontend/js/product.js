// frontend/js/products.js
document.addEventListener('DOMContentLoaded', () => {
  // Product listing (for index.html)
  const productsList = document.getElementById('products-list');
  if (productsList) {
    loadProducts();
  }

  // Product details (for product.html)
  const productDetails = document.getElementById('product-details');
  if (productDetails) {
    loadProductDetails();
  }

  // Function to load all products
  async function loadProducts() {
    try {
      const products = await apiRequest('/products');
      productsList.innerHTML = products.map(product => `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}" style="width: 200px; height: 150px;">
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
          <a href="product.html?id=${product._id}">View Details</a>
        </div>
      `).join('');
    } catch (error) {
      productsList.innerHTML = '<p>Error loading products. Check if the backend is running.</p>';
      console.error('Load products error:', error);
    }
  }

  // Function to load single product details
  async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) {
      productDetails.innerHTML = '<p>Product not found.</p>';
      return;
    }
    try {
      const product = await apiRequest(`/products/${productId}`);
      productDetails.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width: 300px; height: 200px;">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
      `;
    } catch (error) {
      productDetails.innerHTML = '<p>Error loading product details.</p>';
      console.error('Load product details error:', error);
    }
  }
});