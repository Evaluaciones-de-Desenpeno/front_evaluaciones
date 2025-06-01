document.getElementById("registroForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;
  const rol_id = document.getElementById("rol_id").value;
  const mensaje = document.getElementById("mensaje");

  try {
    const response = await fetch("http://localhost:3000/user/usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, correo, contrasena, rol_id }),
    });

    const data = await response.json();

    if (response.ok) {
      mensaje.textContent = "Usuario registrado correctamente. Redirigiendo...";
      mensaje.classList.add("success");
      setTimeout(() => {
        window.location.href = "/"; // Redirige al login después del registro
      }, 2000);
    } else {
      mensaje.textContent = data.message || "Error al registrar usuario.";
      mensaje.classList.add("error");
    }
  } catch (err) {
    console.error("Error:", err);
    mensaje.textContent = "Ocurrió un error al registrar.";
    mensaje.classList.add("error");
  }
});


document.addEventListener("DOMContentLoaded", async () => {
  const selectRol = document.getElementById("rol_id");

  try {
    const response = await fetch("http://localhost:3000/user/roles");
    const data = await response.json();

    const roles = data.body; //Aquí accedemos al array de roles

    selectRol.innerHTML = `<option value="">Seleccione un rol</option>`;

    roles.forEach(rol => {
      const option = document.createElement("option");
      option.value = rol.rol_id;
      option.textContent = rol.nombre;
      selectRol.appendChild(option);
    });
  } catch (err) {
    console.error("Error al cargar roles:", err);
    selectRol.innerHTML = `<option value="">No se pudieron cargar los roles</option>`;
  }
});

// Función para mostrar/ocultar la contraseña
function togglePassword() {
    const passwordInput = document.getElementById('contrasena');
    const toggleIcon = document.getElementById('toggle-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = 'img/abierto.png';
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = 'img/cerrado.png';
    }
}

