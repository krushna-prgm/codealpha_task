// frontend/js/app.js
const API_BASE = 'http://localhost:5000/api'; // Backend URL

// Utility: Get JWT token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Utility: Make authenticated API requests
async function apiRequest(url, options = {}) {
  const token = getToken();
  if (token) {
    options.headers = { ...options.headers, Authorization: `Bearer ${token}` };
  }
  const response = await fetch(`${API_BASE}${url}`, options);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

// Render navbar dynamically
function renderNavbar() {
  const nav = document.getElementById('navbar');
  const token = getToken();
  nav.innerHTML = `
    <a href="index.html">Home</a>
    ${token ? '<a href="cart.html">Cart</a> <a href="#" id="logout">Logout</a>' : '<a href="login.html">Login</a> <a href="register.html">Register</a>'}
  `;
  // Logout handler
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await apiRequest('/auth/logout', { method: 'POST' });
      } catch (e) {
        console.error('Logout error:', e);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    });
  }
}

// Check login status on page load
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
});