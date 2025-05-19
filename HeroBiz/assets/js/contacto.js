// Envío asíncrono del formulario de contacto
// Este archivo debe ser referenciado en contacto.html

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const loading = form.querySelector('.loading');
        const errorMsg = form.querySelector('.error-message');
        const sentMsg = form.querySelector('.sent-message');
        loading.style.display = 'block';
        errorMsg.style.display = 'none';
        sentMsg.style.display = 'none';
        // Simulación de envío asíncrono
        try {
          // Aquí podrías hacer un fetch real a un backend
          await new Promise(resolve => setTimeout(resolve, 1200)); // Simula retardo
          loading.style.display = 'none';
          sentMsg.style.display = 'block';
          form.reset();
        } catch (err) {
          loading.style.display = 'none';
          errorMsg.textContent = 'Ocurrió un error. Intenta de nuevo.';
          errorMsg.style.display = 'block';
        }
      });
    }
  }); 