import React, { useEffect, useState } from "react";
import Lowlight from "react-lowlight";
import registerLanguage from "./auxiliar"; // Import the utility function
import { motion } from "framer-motion";
import DOMPurify from "dompurify";

import "highlight.js/styles/github-dark.css";

function Cuestionario({ tech, language }) {
  const techAct = tech;
  const languageAct = language;
  const [preguntasArray, setPreguntasArray] = useState([]);
  const [pregunta, setPregunta] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);

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
            `http://127.0.0.1:8000/pregunta?id=${idpregunta}&tech=${techAct}`
          );
          let data = null;
          if (!response.ok) {
            data = null;
            return;
          }
          data = await response.json();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/primerapregunta?tech=" + techAct
        );
        let data = null;
        if (!response.ok) {
          data = null;
          return;
        }
        data = await response.json();
        setPregunta(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [techAct]);

  useEffect(() => {
    // Dynamically register the language
    registerLanguage(languageAct);
  }, [languageAct]);

  function nextQuestion(idpregunta, idrespuesta) {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/siguiente?tech=${techAct}&actual=${idpregunta}&answer=${idrespuesta}`
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
            __html: DOMPurify.sanitize(pregunta.preText),
          }}
        ></p>

        {pregunta.command?.length > 0 && (
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

        <h2 className="pregunta">{pregunta.text}</h2>

        <section>
          <form className="respuestas">
            {pregunta.answers?.map((answer) => (
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
                        __html: DOMPurify.sanitize(selectedAnswer.additionalText),
                      }}
                    ></p>
                  ) : (
                    <p
                      className="preText"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(selectedAnswer.additionalText),
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
            </>
          )}

          <div className="botonesMic">
            <button
              className="butNorm anteriorBut"
              disabled={pregunta.id === 1}
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
                nextQuestion(pregunta.id, selectedAnswer.id);
              }}
              className="butNorm siguienteBut"
              disabled={pregunta.last || selectedAnswer === null}
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
