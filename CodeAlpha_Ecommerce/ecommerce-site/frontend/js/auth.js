// frontend/js/auth.js
//const API_BASE = 'http://localhost:5000/api'; // Your backend URL

document.addEventListener('DOMContentLoaded', () => {

  // ---------- REGISTER ----------
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(registerForm);
      const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
      };

      console.log('Registering user:', data); // Debug log

      try {
        const response = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          alert('✅ Registration successful! Please log in.');
          window.location.href = 'login.html';
        } else {
          alert('❌ Registration failed: ' + result.message);
        }
      } catch (error) {
        alert('❌ Registration failed: ' + error.message);
      }
    });
  }

  // ---------- LOGIN ----------
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(loginForm);
      const data = {
        email: formData.get('email'),
        password: formData.get('password')
      };

      console.log('Logging in user:', data); // Debug log

      try {
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          // Save token & user info
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));

          alert('✅ Login successful!');
          window.location.href = 'index.html';
        } else {
          alert('❌ Login failed: ' + result.message);
        }
      } catch (error) {
        alert('❌ Login failed: ' + error.message);
      }
    });
  }

});
