document.addEventListener("DOMContentLoaded", () => {
    const nombre = localStorage.getItem("nombre");
    const rolNombre = localStorage.getItem("rol_nombre");
    const rolId = localStorage.getItem("rol");

    if (!nombre || !rolNombre || !rolId) {
        window.location.href = "/";
        return;
    }

    document.getElementById("rol").textContent = rolNombre;
    document.getElementById("nombre-evaluado").value = nombre;
    document.getElementById("cargo-evaluado").value = rolNombre;

    marcarEstado("respuestas_objetivo", "#btn-objetivo", ".estado-objetivo");
    marcarEstado("respuestas_corporativas", "#btn-corporativas", ".estado-corporativas");
    marcarEstado("respuestas_blandas", "#btn-blandas", ".estado-blandas");

    verificarFinalizacionEvaluacion();

    document.querySelectorAll(".pregunta-botón").forEach(btn => {
        const texto = btn.textContent.toLowerCase();

        if (texto.includes("objetivo")) {
            btn.addEventListener("click", () => window.location.href = `/objetivo?rol_id=${rolId}`);
        } else if (texto.includes("corporativas")) {
            btn.addEventListener("click", () => window.location.href = `/coorporativas?rol_id=${rolId}`);
        } else if (texto.includes("blandas")) {
            btn.addEventListener("click", () => window.location.href = `/blandas?rol_id=${rolId}`);
        }
    });

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

        // Validar respuestas antes de enviar
        const errores = validarRespuestasLocalStorage(respuestas);
        if (errores.length > 0) {
            alert("⚠️ Corrige los siguientes errores antes de enviar:\n\n" + errores.join("\n"));
            return;
        }

        // ✅ Mostrar en consola lo que se enviará
console.log("🔍 Respuestas que se enviarán:");
["objetivo", "corporativas", "blandas"].forEach(tipo => {
    console.log(`\n🔸 Sección: ${tipo.toUpperCase()}`);
    respuestas[tipo].forEach(r => {
        console.log(`Pregunta ID: ${r.pregunta_id}, Respuesta: ${r.respuesta}`);
    });
});

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

// 🔎 Validar respuestas antes de enviar
function validarRespuestasLocalStorage(respuestas) {
    const errores = [];

    const validarGrupo = (grupo, nombre) => {
        if (!Array.isArray(grupo) || grupo.length === 0) {
            errores.push(`❌ No hay respuestas para la sección: ${nombre}`);
            return;
        }

        grupo.forEach((r, index) => {
            if (typeof r.pregunta_id !== "number") {
                errores.push(`❌ Pregunta inválida en ${nombre}, índice ${index}: ID no es un número`);
            }
            if (!["siempre", "nunca", "aveces", "a veces"].includes(r.respuesta?.toLowerCase())) {
                errores.push(`❌ Respuesta inválida en ${nombre}, índice ${index}: "${r.respuesta}"`);
            }
        });
    };

    validarGrupo(respuestas.objetivo, "Objetivo");
    validarGrupo(respuestas.corporativas, "Corporativas");
    validarGrupo(respuestas.blandas, "Blandas");

    return errores;
}

// ✅ Marcar botón como completado
function marcarEstado(keyStorage, idBoton, claseIndicador) {
    const data = JSON.parse(localStorage.getItem(keyStorage));
    if (data && data.length > 0) {
        const btn = document.querySelector(`${idBoton} button`);
        const indicador = document.querySelector(claseIndicador);
        btn.disabled = true;
        indicador.classList.add("completado");
    }
}

// ✅ Activar botón final si todas las secciones están completas
function verificarFinalizacionEvaluacion() {
    const objetivo = localStorage.getItem("respuestas_objetivo");
    const corporativas = localStorage.getItem("respuestas_corporativas");
    const blandas = localStorage.getItem("respuestas_blandas");

    const botonFinal = document.querySelector(".enviar-respuestas");
    botonFinal.disabled = !(objetivo && corporativas && blandas);
}
