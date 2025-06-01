document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const rol_id = params.get("rol_id");

    if (!rol_id) {
        alert("Rol no encontrado. Redirigiendo...");
        window.location.href = "/menu";
        return;
    }

    try {
        // 1. Traer el objetivo del rol
       const objetivoRes = await fetch(`http://localhost:3000/evaluacion/objetivo?rol_id=${rol_id}`);
if (!objetivoRes.ok) throw new Error("Objetivo no encontrado");

const objetivoData = await objetivoRes.json();

        const objetivo = objetivoData.body[0];

        if (!objetivo) {
            document.querySelector(".descripcion").textContent = "No se encontró el objetivo.";
            return;
        }

        // Mostrar descripción del objetivo
        document.querySelector(".descripcion").textContent = objetivo.objetivo;

        // 2. Traer las preguntas del objetivo
        const preguntasRes = await fetch(`http://localhost:3000/evaluacion/objepregunta?objetivo_id=${objetivo.objetivo_id}`);
        const preguntasData = await preguntasRes.json();
        const preguntas = preguntasData.body;

        const tbody = document.querySelector(".preguntas-table tbody");
        tbody.innerHTML = ""; // ✅ Elimina contenido previo


        preguntas.forEach((pregunta, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td data-id="${pregunta.ID}">${pregunta.Pregunta}</td>
        <td><input type="radio" name="respuesta${index}" value="siempre"></td>
        <td><input type="radio" name="respuesta${index}" value="aveces"></td>
        <td><input type="radio" name="respuesta${index}" value="nunca"></td>
    `;

    tbody.appendChild(tr);
});

    } catch (err) {
        console.error("Error cargando objetivo o preguntas:", err);
        document.querySelector(".descripcion").textContent = "Error al cargar objetivo.";
    }
});

document.getElementById("btnSiguiente").addEventListener("click", () => {
    const respuestas = [];
    const filas = document.querySelectorAll(".preguntas-table tbody tr");

    let todasRespondidas = true;

    filas.forEach((fila, index) => {
        const preguntaID = fila.querySelector("td").getAttribute("data-id");
        const radios = fila.querySelectorAll(`input[name="respuesta${index}"]`);
        let respuestaSeleccionada = null;

        radios.forEach(radio => {
            if (radio.checked) {
                respuestaSeleccionada = radio.value;
            }
        });

        if (!respuestaSeleccionada) {
            todasRespondidas = false;
        } else {
            respuestas.push({
                pregunta_id: parseInt(preguntaID),
                respuesta: respuestaSeleccionada
            });
        }
    });

    if (!todasRespondidas) {
        alert("⚠️ Debes responder todas las preguntas para continuar.");
        return;
    }

    // Guardar en localStorage
    localStorage.setItem("respuestas_objetivo", JSON.stringify(respuestas));
    console.log("✅ Respuestas objetivo guardadas:", respuestas);

    // Redirigir al menú
    window.location.href = "/menu";
});


