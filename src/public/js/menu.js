document.addEventListener("DOMContentLoaded", () => {
    const nombre = localStorage.getItem("nombre");
    const rolNombre = localStorage.getItem("rol_nombre");
    const rolId = localStorage.getItem("rol");

    if (!nombre || !rolNombre || !rolId) {
        window.location.href = "/";
        return;
    }

    // Mostrar rol en el encabezado
    document.getElementById("rol").textContent = rolNombre;

    // Rellenar datos del evaluado
    document.getElementById("nombre-evaluado").value = nombre;
    document.getElementById("cargo-evaluado").value = rolNombre;

    // Marcar secciones completadas
    marcarEstado("respuestas_objetivo", "#btn-objetivo", ".estado-objetivo");
    marcarEstado("respuestas_corporativas", "#btn-corporativas", ".estado-corporativas");
    marcarEstado("respuestas_blandas", "#btn-blandas", ".estado-blandas");

    // Verificar si se puede activar el botón final
    verificarFinalizacionEvaluacion();

    // Redirecciones a vistas
    document.querySelectorAll(".pregunta-botón").forEach(btn => {
        const texto = btn.textContent.toLowerCase();

        if (texto.includes("objetivo")) {
            btn.addEventListener("click", () => {
                window.location.href = `/objetivo?rol_id=${rolId}`;
            });
        } else if (texto.includes("corporativas")) {
            btn.addEventListener("click", () => {
                window.location.href = `/coorporativas?rol_id=${rolId}`;
            });
        } else if (texto.includes("blandas")) {
            btn.addEventListener("click", () => {
                window.location.href = `/blandas?rol_id=${rolId}`;
            });
        }
    });

    // Enviar respuestas finales
    document.querySelector(".enviar-respuestas").addEventListener("click", async (e) => {
        e.preventDefault();

        const nombreEvaluado = document.getElementById("nombre-evaluado").value;
        const cargoEvaluado = document.getElementById("cargo-evaluado").value;
        const nombreEvaluador = document.getElementById("nombre-evaluador").value;
        const cargoEvaluador = document.getElementById("cargo-evaluador").value;
        const fechaEvaluacion = document.getElementById("fecha-evaluacion").value;

        if (!fechaEvaluacion || !nombreEvaluador || !cargoEvaluador) {
            alert("⚠️ Debes completar todos los campos antes de enviar.");
            return;
        }

        const respuestas = {
            objetivo: JSON.parse(localStorage.getItem("respuestas_objetivo")),
            corporativas: JSON.parse(localStorage.getItem("respuestas_corporativas")),
            blandas: JSON.parse(localStorage.getItem("respuestas_blandas")),
        };

        const payload = {
            nombreEvaluado,
            cargoEvaluado,
            nombreEvaluador,
            cargoEvaluador,
            fechaEvaluacion,
            respuestas,
        };

        try {
            const res = await fetch("http://localhost:3000/respuestas/guardar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                alert("✅ Evaluación enviada correctamente.");
                localStorage.clear();
                window.location.href = "/login";
            } else {
                alert("❌ Error al guardar la evaluación.");
                console.error(data);
            }
        } catch (err) {
            console.error("Error de conexión:", err);
            alert("❌ No se pudo conectar con el servidor.");
        }
    });
});

// Marcar botón como completado
function marcarEstado(keyStorage, idBoton, claseIndicador) {
    const data = JSON.parse(localStorage.getItem(keyStorage));
    if (data && data.length > 0) {
        const btn = document.querySelector(`${idBoton} button`);
        const indicador = document.querySelector(claseIndicador);
        btn.disabled = true;
        indicador.classList.add("completado");
    }
}

// Habilitar botón final si todo está respondido
function verificarFinalizacionEvaluacion() {
    const objetivo = localStorage.getItem("respuestas_objetivo");
    const corporativas = localStorage.getItem("respuestas_corporativas");
    const blandas = localStorage.getItem("respuestas_blandas");

    const botonFinal = document.querySelector(".enviar-respuestas");
    if (objetivo && corporativas && blandas) {
        botonFinal.disabled = false;
    } else {
        botonFinal.disabled = true;
    }
}
