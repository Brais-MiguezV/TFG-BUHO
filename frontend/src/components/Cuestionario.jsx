import React, { useEffect, useState } from "react";
import Lowlight from "react-lowlight";
import registerLanguage from "./auxiliar";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";

import "highlight.js/styles/github-dark.css";

registerLanguage("bash"); // Registrar el lenguaje bash por defecto

function Cuestionario({ tech, language, nombreTech }) {
  const navigate = useNavigate(); // Hook para navegar entre páginas
  const techAct = tech; // Guardar la tecnología actual
  const languageAct = language; // Guardar el lenguaje actual

  const [preguntasArray, setPreguntasArray] = useState(() => {
    const saved = sessionStorage.getItem("preguntasArray");
    return saved ? JSON.parse(saved) : [];
  }); // Guardar las preguntas en un array para poder retroceder en el cuestionario si es necesario (se guarda en el sessionStorage)

  const [pregunta, setPregunta] = useState(() => {
    const saved = sessionStorage.getItem("pregunta");
    return saved ? JSON.parse(saved) : {};
  }); // Guardar la pregunta actual (se guarda en el sessionStorage)

  const [selectedAnswer, setSelectedAnswer] = useState(() => {
    const saved = sessionStorage.getItem("selectedAnswer");
    return saved ? JSON.parse(saved) : null;
  }); // Guardar la respuesta seleccionada (se guarda en el sessionStorage)

  useEffect(() => {
    sessionStorage.setItem("preguntasArray", JSON.stringify(preguntasArray));
  }, [preguntasArray]); // Guardar el array de preguntas en el sessionStorage

  useEffect(() => {
    sessionStorage.setItem("pregunta", JSON.stringify(pregunta));
  }, [pregunta]); // Guardar la pregunta actual en el sessionStorage

  useEffect(() => {
    sessionStorage.setItem("selectedAnswer", JSON.stringify(selectedAnswer));
  }, [selectedAnswer]); // Guardar la respuesta seleccionada en el sessionStorage

  useEffect(() => {
    setPregunta(null); // Resetear la pregunta actual al cambiar de tecnología

    const fetchData = async () => {
      try {
        if (techAct === undefined) {
          return;
        }
        const response = await fetch(
          `http://${window.location.hostname}:8000/pregunta?tech=${techAct}&id=1`
        ); // Fetch de la primera pregunta de la tecnología seleccionada

        if (response.status === 404) {
          navigate("/404");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch the first question"); // Error si no se puede hacer el fetch
        }

        const data = await response.json(); // Guardar la pregunta en data
        setPregunta(data); // Guardar la pregunta en el estado
      } catch (error) {
        console.error("Error fetching data: ", error); // Error si no se puede hacer el fetch
      }
    };

    fetchData(); // Llamar a la función fetchData
  }, [techAct]); // Recargar la página al cambiar de tecnología

  useEffect(() => {
    registerLanguage(languageAct); // Registrar el lenguaje seleccionado de forma dinámica
  }, [languageAct]); // Cambiar el lenguaje al seleccionar uno nuevo

  function previousQuestion() {
    /**
     * Recupera la pregunta anterior y la respuesta seleccionada de la lista de preguntas
     *
     * Si no hay preguntas en la lista, muestra un mensaje de advertencia
     *
     * Si hay preguntas en la lista, recupera la última entrada de la lista y realiza un fetch de la pregunta anterior
     *
     * Si no se puede hacer el fetch, muestra un mensaje de error
     */

    if (preguntasArray.length > 0) {
      // Si hay preguntas en la lista
      const lastEntry = preguntasArray[preguntasArray.length - 1]; // Recuperar la última entrada de la lista
      const { idpregunta, idrespuesta } = lastEntry; // Guardar el id de la pregunta y de la respuesta seleccionada

      // Eliminar la última entrada de la lista de preguntas
      setPreguntasArray((prevPreguntasArray) =>
        prevPreguntasArray.slice(0, -1)
      );

      // Recuperar la pregunta anterior y la respuesta seleccionada
      const fetchData = async () => {
        try {
          if (techAct === undefined) {
            return;
          }
          const response = await fetch(
            `http://${window.location.hostname}:8000/pregunta?id=${idpregunta}&tech=${techAct}`
          );

          if (response.status === 404) {
            navigate("/404");
            return;
          }

          if (!response.ok) {
            throw new Error("Failed to fetch the previous question");
          }

          const data = await response.json(); // Guardar la pregunta anterior
          setPregunta(data); // Guardar la pregunta anterior

          // Recuperar la respuesta seleccionada
          const previousAnswer = data.answers.find(
            (answer) => answer.id === idrespuesta
          );

          setSelectedAnswer(previousAnswer); // Guardar la respuesta seleccionada
        } catch (error) {
          console.error("Error fetching data: ", error); // Error si no se puede hacer el fetch
        }
      };

      fetchData(); // Llamar a la función fetchData
    } else {
      console.warn("No previous question available"); // Mostrar un mensaje de advertencia si no hay preguntas en la lista
    }
  }

  function renderAnswer(respuesta) {
    // Mostrar la respuesta seleccionada
    setSelectedAnswer(respuesta); // Guardar la respuesta seleccionada en el estado selectedAnswer
  }

  function nextQuestion(idpregunta, idrespuesta) {
    /**
     * Realiza un fetch de la siguiente pregunta y guarda la pregunta actual y la respuesta seleccionada en la lista de preguntas
     *
     * Si no se puede hacer el fetch, muestra un mensaje de error
     *
     * Si la pregunta actual es la última, muestra un mensaje de felicitación
     *
     * Si la respuesta seleccionada es nula, no hace nada
     *
     * @param {number} idpregunta - El id de la pregunta actual
     * @param {number} idrespuesta - El id de la respuesta seleccionada
     */

    const fetchData = async () => {
      try {
        if (techAct === undefined) {
          return;
        }
        const response = await fetch(
          `http://${window.location.hostname}:8000/siguiente?tech=${techAct}&actual=${idpregunta}&answer=${idrespuesta}`
        );

        if (response.status === 404) {
          navigate("/404");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch the next question");
        }

        const data = await response.json(); // Guardar la siguiente pregunta
        setPregunta(data); // Guardar la siguiente pregunta

        setPreguntasArray((prevPreguntasArray) => [
          ...prevPreguntasArray,
          { idpregunta, idrespuesta },
        ]); // Guardar la pregunta actual y la respuesta seleccionada en la lista de preguntas
      } catch (error) {
        console.error("Error fetching data:", error); // Error si no se puede hacer el fetch
      }
    };

    fetchData(); // Llamar a la función fetchData

    setSelectedAnswer(null); // Resetear la respuesta seleccionada
  }

  return (
    <section className="cuestionarioSect">
      <div className="preguntaSect">
        <p
          className="preText"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(pregunta?.preText || ""),
          }} // Muestra el texto preivio de la pregunta actual
        ></p>
        {pregunta?.command?.length > 0 && ( // Muestra el comando de la pregunta actual si lo hay
          <div className="command">
            <div className="code-block">
              <Lowlight
                language={
                  Lowlight.hasLanguage(languageAct) ? languageAct : "bash"
                }
                value={pregunta.command.join("\n")}
                className="code"
              />
            </div>
            {pregunta.notes && ( // Muestra las notas de la pregunta actual si las hay
              <p className="notes">
                <em>{pregunta.notes}</em>
              </p>
            )}
          </div>
        )}
        <h2 className="pregunta">{pregunta?.text}</h2>{" "}
        {/* Muestra el texto de la pregunta actual */}
        <section>
          <form className="respuestas">
            {pregunta?.answers?.map(
              (
                answer // Muestra las respuestas de la pregunta actual y las guarda en el estado selectedAnswer
              ) => (
                <button
                  key={answer.id}
                  className={`respuesta ${
                    selectedAnswer?.id === answer.id ? "selected" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault(); // Prevenir la selección de la respuesta
                    renderAnswer(answer); // Guardar la respuesta seleccionada
                  }}
                >
                  {answer.text} {/* Muestra el texto de la respuesta */}
                </button>
              )
            )}
          </form>

          <div className="separador"></div>
          {selectedAnswer && ( // Muestra la respuesta seleccionada y los datos asociados a ella
            <>
              <div className="respuestaRender">
                <motion.div
                  key={selectedAnswer.id}
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  {selectedAnswer.important === true ? (
                    <p
                      className="important"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          selectedAnswer.additionalText
                        ),
                      }}
                    ></p>
                  ) : (
                    <p
                      className="preText"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          selectedAnswer.additionalText
                        ),
                      }}
                    ></p>
                  )}

                  {selectedAnswer.command?.length > 0 && (
                    <div className="command">
                      <div className="code-block">
                        <Lowlight
                          language={
                            Lowlight.hasLanguage(languageAct)
                              ? languageAct
                              : "bash"
                          }
                          value={selectedAnswer.command.join("\n")}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {pregunta?.last && ( // Muestra un mensaje de felicitación si la pregunta actual es la última
                <p>
                  ¡Enhorabuena! Has completado el cuestionario. Si has seguido
                  las instrucciones, deberías haber configurado correctamente tu{" "}
                  {nombreTech} para que sea más seguro.
                </p>
              )}
            </>
          )}

          <div className="botonesMic">
            <button
              className="butNorm anteriorBut"
              disabled={pregunta?.id === 1}
              onClick={(e) => {
                e.preventDefault();
                previousQuestion();
              }}
            >
              Anterior
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                if (pregunta?.last) {
                  setPregunta(null);
                  setPreguntasArray([]);
                  setSelectedAnswer(null);

                  window.location.reload();
                } else {
                  nextQuestion(pregunta?.id, selectedAnswer?.id);
                }
              }}
              className="butNorm siguienteBut"
            >
              {pregunta?.last ? "Volver al principio" : "Siguiente"}
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Cuestionario;
