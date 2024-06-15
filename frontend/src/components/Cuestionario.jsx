import React, { useEffect, useState } from "react";
import Lowlight from "react-lowlight";
import registerLanguage from "./auxiliar"; // Import the utility function
import { motion } from "framer-motion";
import DOMPurify from "dompurify";

import "highlight.js/styles/github-dark.css";

// Register the languages
registerLanguage('bash');

function Cuestionario({ tech, language }) {
  const techAct = tech;
  const languageAct = language;
  const [preguntasArray, setPreguntasArray] = useState(() => {
    const saved = sessionStorage.getItem("preguntasArray");
    return saved ? JSON.parse(saved) : [];
  });
  const [pregunta, setPregunta] = useState(() => {
    const saved = sessionStorage.getItem("pregunta");
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedAnswer, setSelectedAnswer] = useState(() => {
    const saved = sessionStorage.getItem("selectedAnswer");
    return saved ? JSON.parse(saved) : null;
  });

  // Save state to session storage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("preguntasArray", JSON.stringify(preguntasArray));
  }, [preguntasArray]);

  useEffect(() => {
    sessionStorage.setItem("pregunta", JSON.stringify(pregunta));
  }, [pregunta]);

  useEffect(() => {
    sessionStorage.setItem("selectedAnswer", JSON.stringify(selectedAnswer));
  }, [selectedAnswer]);

  useEffect(() => {
    // Reset pregunta to null when tech changes
    setPregunta(null);

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://${window.location.hostname}:8000/pregunta?tech=${techAct}&id=1`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the first question");
        }
        const data = await response.json();
        setPregunta(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [techAct]); // Re-fetch when tech changes

  useEffect(() => {
    // Dynamically register the language
    registerLanguage(languageAct);
  }, [languageAct]);

  function previousQuestion() {
    if (preguntasArray.length > 0) {
      const lastEntry = preguntasArray[preguntasArray.length - 1];
      const { idpregunta, idrespuesta } = lastEntry;

      // Remove the last entry from the preguntasArray
      setPreguntasArray((prevPreguntasArray) =>
        prevPreguntasArray.slice(0, -1)
      );

      // Fetch the previous question data based on the last entry
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://${window.location.hostname}:8000/pregunta?id=${idpregunta}&tech=${techAct}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch the previous question");
          }
          const data = await response.json();
          setPregunta(data);

          // Find and set the selected answer
          const previousAnswer = data.answers.find(
            (answer) => answer.id === idrespuesta
          );
          setSelectedAnswer(previousAnswer);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };

      fetchData();
    } else {
      console.warn("No previous question available");
    }
  }

  function renderAnswer(respuesta) {
    setSelectedAnswer(respuesta);
  }

  function nextQuestion(idpregunta, idrespuesta) {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://${window.location.hostname}:8000/siguiente?tech=${techAct}&actual=${idpregunta}&answer=${idrespuesta}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the next question");
        }
        const data = await response.json();
        setPregunta(data);

        setPreguntasArray((prevPreguntasArray) => [
          ...prevPreguntasArray,
          { idpregunta, idrespuesta },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    setSelectedAnswer(null);
  }

  return (
    <section className="cuestionarioSect">
      <div className="preguntaSect">
        <p
          className="preText"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(pregunta?.preText || ''),
          }}
        ></p>

        {pregunta?.command?.length > 0 && (
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
            {pregunta.notes && (
              <p className="notes">
                <em>{pregunta.notes}</em>
              </p>
            )}
          </div>
        )}

        <h2 className="pregunta">{pregunta?.text}</h2>

        <section>
          <form className="respuestas">
            {pregunta?.answers?.map((answer) => (
              <button
                key={answer.id}
                className={`respuesta ${
                  selectedAnswer?.id === answer.id ? "selected" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault(); // prevent form submission
                  renderAnswer(answer);
                }}
              >
                {answer.text}
              </button>
            ))}
          </form>

          <div className="separador"></div>
          {selectedAnswer && (
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

              {pregunta?.last && (
                <p>
                  ¡Enhorabuena! Has completado el cuestionario. Si has seguido
                  las instrucciones, deberías haber configurado correctamente tu{" "}
                  {techAct} para que sea más seguro.
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
                e.preventDefault(); // prevent form submission
                nextQuestion(pregunta?.id, selectedAnswer?.id);
              }}
              className="butNorm siguienteBut"
              disabled={pregunta?.last || selectedAnswer === null}
            >
              Siguiente
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Cuestionario;
