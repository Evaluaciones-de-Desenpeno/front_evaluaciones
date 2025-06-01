document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const rol_id = params.get("rol_id");

    if (!rol_id) {
        alert("Rol no válido");
        window.location.href = "/menu";
        return;
    }

    try {
        const contenedor = document.querySelector(".preguntas-table tbody");

        // 1. Traer todas las competencias
        const resCompetencias = await fetch(
            `http://localhost:3000/evaluacion/competencia?rol_id=${rol_id}`
        );
        if (!resCompetencias.ok) throw new Error("No se encontraron competencias");

        const dataCompetencias = await resCompetencias.json();
        const competencias = dataCompetencias.body;

        // 2. Filtrar solo blandas
        const competenciasBlandas = competencias.filter(
            (c) => c.tipo === "BLANDA"
        );

        for (const competencia of competenciasBlandas) {
            // Título por competencia
            const trTitulo = document.createElement("tr");
            trTitulo.innerHTML = `
                <td colspan="4" style="text-align:left; font-weight:bold; background-color:#d9edf7;">
                    ${competencia.competencias}
                </td>
            `;
            contenedor.appendChild(trTitulo);

            // 3. Cargar preguntas de cada competencia
            const resPreguntas = await fetch(
                `http://localhost:3000/evaluacion/compepregunta?competencia_id=${competencia.competencias_id}`
            );
            const dataPreguntas = await resPreguntas.json();
            const preguntas = dataPreguntas.body;

            if (!Array.isArray(preguntas)) continue;

            preguntas.forEach((pregunta, index) => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${pregunta.Pregunta}</td>
                    <td><input type="radio" name="respuesta_${pregunta.ID}" value="siempre"></td>
                    <td><input type="radio" name="respuesta_${pregunta.ID}" value="aveces"></td>
                    <td><input type="radio" name="respuesta_${pregunta.ID}" value="nunca"></td>
                `;

                contenedor.appendChild(tr);
            });
        }

        // 4. Validar y guardar al dar clic en "Siguiente"
        document.getElementById("btnSiguiente").addEventListener("click", () => {
            const respuestas = [];
            let incompletas = false;

            document.querySelectorAll("tr").forEach((fila) => {
                const radio = fila.querySelector("input[type='radio']:checked");
                const input = fila.querySelector("input[type='radio']");

                if (input) {
                    const preguntaId = input.name.split("_")[1];

                    if (!radio) {
                        incompletas = true;
                    } else {
                        respuestas.push({
                            pregunta_id: parseInt(preguntaId),
                            respuesta: radio.value,
                        });
                    }
                }
            });

            if (incompletas) {
                alert("⚠️ Debes responder todas las preguntas.");
                return;
            }

            localStorage.setItem("respuestas_blandas", JSON.stringify(respuestas));
            console.log("✅ Guardado en localStorage: respuestas_blandas", respuestas);
            window.location.href = "/menu";
        });

    } catch (err) {
        console.error("Error al cargar competencias blandas:", err);
        document.querySelector(".descripcion").textContent =
            "Error al cargar competencias blandas.";
    }
});
