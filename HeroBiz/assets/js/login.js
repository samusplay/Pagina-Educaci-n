document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const messageDiv = document.getElementById('login-message');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    messageDiv.style.display = 'none';
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    form.querySelector('button[type="submit"]').disabled = true;
    try {
      // Cambia la URL por la de tu backend real
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        messageDiv.classList.remove('text-danger');
        messageDiv.classList.add('text-success');
        messageDiv.textContent = data.message || '¡Inicio de sesión exitoso!';
        messageDiv.style.display = 'block';
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);
      } else {
        messageDiv.classList.remove('text-success');
        messageDiv.classList.add('text-danger');
        messageDiv.textContent = data.message || 'Usuario o contraseña incorrectos.';
        messageDiv.style.display = 'block';
        form.querySelector('button[type="submit"]').disabled = false;
      }
    } catch (err) {
      messageDiv.classList.remove('text-success');
      messageDiv.classList.add('text-danger');
      messageDiv.textContent = 'Error de conexión con el servidor.';
      messageDiv.style.display = 'block';
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
}); 