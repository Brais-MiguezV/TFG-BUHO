import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const [datos, setDatos] = useState([]); // Estado para almacenar los datos de las tecnologías

  useEffect(() => { // Hook para obtener los datos de las tecnologías
    const fetchData = async () => {  // Función asíncrona para obtener los datos de las tecnologías
      try {
        const response = await fetch(`http://${window.location.hostname}:8000/tecnologias`);
        const data = await response.json();
        setDatos(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData(); // Llamar a la función para obtener los datos
    window.scrollTo(0, 0); // Hacer scroll al principio de la página
    
  }, []);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 50 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 1 }}
    >
      <section className="firstSection">
        <h1 className="homeTitle">
          Bienvenidx a <span className="orange">BUHO</span>
        </h1>

        <section className="homeSection">
          <h2 className="homeSubtitle">Antes de empezar, ¿qué es BUHO?</h2>
          <p className="homeText">
            BUHO son las siglas de <em>Best Universal Hardening Operatives</em>.
            ¿Te ha quedado claro? Probablemente no, pero no te preocupes, es
            normal.
          </p>

          <p>
            A día de hoy, ¿cuántas empresas dependen de sistemas informáticos?
            ¿Y cuántas de ellas han sido víctimas de ciberataques? La principal
            causa de estos ciberataques es la falta de conocimiento de cómo
            poder proteger los sistemas de forma más eficiente y efectiva. Es
            por ello que se ha creado esta plataforma. BUHO es el resultado de
            un Trabajo de Fin de Grado que pretende que cualquier persona, sin
            importar su nivel de conocimientos, pueda proteger sus sistemas de
            la mejor forma posible. Evitando así, en la medida de lo posible,
            ser víctima de ciberataques.
          </p>

          <img
            src={process.env.PUBLIC_URL + "/images/meme3.png"}
            alt="Meme de ciberseguridad"
            className="memeImg"
          />

          <h2 className="homeSubtitle">
            Y, ¿cómo lo vamos a hacer? <span role="img">🤔</span>
          </h2>

          <p>
            Hemos pensado que la forma más entretenida para que los usuarios
            puedan proteger sus sistemas es a través de un cuestionario. En base
            a las respuestas de los usuarios, se indicarán una serie de comandos
            para ejecutar y así poder proteger los sistemas de la mejor forma
            posible.
          </p>

          <img
            src={process.env.PUBLIC_URL + "/images/meme4.png"}
            alt="Meme de ciberseguridad"
            className="memeImg"
          />

          <h2 className="homeSubtitle">
            ¿Qué te parece la idea? ¿Te animas a probarlo?
          </h2>

          <p>
            Con el objetivo de tener mejoras constantes, si tienes alguna duda,
            sugerencia o simplemente quieres ponerte en contacto con nosotros,
            no dudes en hacerlo a través de la sección de{" "}
            <Link to="/contact" className="orange">
              contacto
            </Link>
          </p>

          <h2 className="homeSubtitle">
            ¿Qué tecnologías puedes encontrar en BUHO?
          </h2>

          <p>
            En BUHO puedes encontrar información sobre las siguientes
            tecnologías:
          </p>

          <section className="homeTechs">
            {datos?.map((element, index) => (
              <>
                <Link to={"/tech/" + element.tech} key={index}>
                  <article className="homeTech">
                    <img
                      src={process.env.PUBLIC_URL + "/images/" + element.image}
                      alt={"logo de " + element.name}
                      className="homeTechImg"
                    />
                    <p className="homeTechName"> {element.name} </p>
                  </article>
                </Link>
              </>
            ))}
          </section>
        </section>
      </section>
      
    </motion.div>
  );
}

export default Home;
