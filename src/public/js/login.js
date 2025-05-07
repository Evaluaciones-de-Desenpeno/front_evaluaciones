document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const mensaje = document.getElementById('mensaje');

    try {
        
        const response = await fetch(`http://localhost:3000/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: correo, contrasena: contrasena }),
        });

        const data = await response.json();

        console.log("Respuesta completa del backend:", data); // Verifica la estructura de la respuesta

        if (response.ok) {
            // Guardar el token y la información del usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('correo', data.usuario.correo);
            localStorage.setItem('nombre', data.usuario.nombre);
            localStorage.setItem('rol', data.usuario.rol_id);// Guardar el token

            console.log("Token guardado:", data.token);
            console.log("Rol guardado:", data.usuario.rol_id); // Verifica el rol guardado
            console.log("Correo guardado:", data.usuario.correo); // Verifica el correo guardado
            console.log("Nombre guardado:", data.usuario.nombre); // Verifica el nombre guardado
             // Verifica que el token se esté guardando correctamente
            

            let tiempoRestante = 3;
            mensaje.textContent = `Ingreso Exitoso en ${tiempoRestante} segundos...`;
            mensaje.classList.remove('error');
            mensaje.classList.add('success');

            const intervalo = setInterval(() => {
                tiempoRestante--;
                mensaje.textContent = `Ingreso Exitoso en ${tiempoRestante} segundos...`;

                if (tiempoRestante <= 0) {
                    clearInterval(intervalo);
                    window.location.href = '/historial'; // Redirigir a la página principal
                }
            }, 1000);
        } else {
            mensaje.textContent = "Nombre o Contraseña Incorrectos, por favor intente de nuevo.";
            mensaje.classList.remove('success');
            mensaje.classList.add('error');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        mensaje.textContent = 'Error al iniciar sesión, por favor intente de nuevo.';
        mensaje.classList.remove('success');
        mensaje.classList.add('error');
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