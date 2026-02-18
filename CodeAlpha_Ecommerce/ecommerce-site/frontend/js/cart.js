// frontend/js/cart.js
document.addEventListener('DOMContentLoaded', async () => {
  const cartItems = document.getElementById('cart-items');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Load cart items
  async function loadCart() {
    try {
      const cart = await apiRequest('/cart'); // Authenticated request
      if (!cart || cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        return;
      }

      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" style="margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
          <h3>${item.productId.name}</h3>
          <p>Price: $${item.productId.price}</p>
          <input type="number" value="${item.quantity}" min="1" data-id="${item.productId._id}">
          <button class="update-btn" data-id="${item.productId._id}">Update</button>
          <button class="remove-btn" data-id="${item.productId._id}">Remove</button>
        </div>
      `).join('');
    } catch (error) {
      console.error('Load cart error:', error);
      cartItems.innerHTML = '<p>Error loading cart. Please try again later.</p>';
    }
  }

  // Add to cart button on product page
  const addToCartBtn = document.getElementById('add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', async () => {
      const productId = new URLSearchParams(window.location.search).get('id');
      try {
        await apiRequest('/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity: 1 })
        });
        alert('Added to cart!');
      } catch (error) {
        alert('Failed to add to cart: ' + error.message);
      }
    });
  }

  // Handle update and remove buttons
  cartItems.addEventListener('click', async (e) => {
    const parentDiv = e.target.closest('.cart-item'); // find correct cart item
    if (!parentDiv) return;

    const productId = e.target.dataset.id;
    const input = parentDiv.querySelector('input[type="number"]');
    const quantity = input ? parseInt(input.value) : 1;

    // Update quantity
    if (e.target.classList.contains('update-btn')) {
      try {
        await apiRequest('/cart/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity })
        });
        loadCart();
      } catch (error) {
        alert('Update failed: ' + error.message);
      }
    }

    // Remove from cart
    if (e.target.classList.contains('remove-btn')) {
      try {
        await apiRequest(`/cart/remove/${productId}`, { method: 'DELETE' });
        loadCart();
      } catch (error) {
        alert('Remove failed: ' + error.message);
      }
    }
  });

  // Checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }

  // Initial load
  loadCart();
});
