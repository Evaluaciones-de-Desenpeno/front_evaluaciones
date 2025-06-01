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
    const competenciasCorporativa = competencias.filter(
      (c) => c.tipo === "CORPORATIVA"
    );

    for (const competencia of competenciasCorporativa) {
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

      document.querySelectorAll(".preguntas-table tbody tr").forEach((fila) => {
        const radios = fila.querySelectorAll("input[type='radio']");
        if (radios.length === 0) return; // omitir títulos o filas vacías

        const checked = fila.querySelector("input[type='radio']:checked");
        const preguntaId = radios[0].name.split("_")[1];

        if (!checked) {
          incompletas = true;
        } else {
          respuestas.push({
            pregunta_id: parseInt(preguntaId),
            respuesta: checked.value,
          });
        }
      });

      if (incompletas) {
        alert("⚠️ Debes responder todas las preguntas.");
        return;
      }

      localStorage.setItem(
        "respuestas_corporativas",
        JSON.stringify(respuestas)
      );
      console.log(
        "✅ Guardado en localStorage: respuestas_corporativas",
        respuestas
      );
      window.location.href = "/menu";
    });
  } catch (err) {
    console.error("Error al cargar competencias blandas:", err);
    document.querySelector(".descripcion").textContent =
      "Error al cargar competencias blandas.";
  }
});
