document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registroForm');
  const messageDiv = document.getElementById('registro-message');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    messageDiv.style.display = 'none';
    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const usuario = document.getElementById('reg-usuario').value.trim();
    const password = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-password2').value;
    if (password !== password2) {
      messageDiv.classList.remove('text-success');
      messageDiv.classList.add('text-danger');
      messageDiv.textContent = 'Las contraseñas no coinciden.';
      messageDiv.style.display = 'block';
      return;
    }
    form.querySelector('button[type="submit"]').disabled = true;
    try {
      // Cambia la URL por la de tu backend real
      const response = await fetch('/api/registro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, usuario, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        messageDiv.classList.remove('text-danger');
        messageDiv.classList.add('text-success');
        messageDiv.textContent = data.message || '¡Registro exitoso! Ahora puedes iniciar sesión.';
        messageDiv.style.display = 'block';
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } else {
        messageDiv.classList.remove('text-success');
        messageDiv.classList.add('text-danger');
        messageDiv.textContent = data.message || 'Por favor, completa todos los campos correctamente.';
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