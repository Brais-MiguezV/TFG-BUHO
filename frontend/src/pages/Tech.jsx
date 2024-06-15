import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cuestionario from "../components/Cuestionario";
import { motion } from "framer-motion";

function Tech() {
  const location = useLocation(); // Hook para obtener la ubicación actual

  const locationSplit = location.pathname.split("/"); // Dividir la ubicación actual en partes

  const actualTech = locationSplit[locationSplit.length - 1]; // Obtener la última parte de la ubicación actual (la tecnología actual)

  const [datos, setDatos] = useState([]); // Estado para almacenar los datos de la tecnología actual

  useEffect(() => { // Hook para obtener los datos de la tecnología actual
    const fetchData = async () => { // Función asíncrona para obtener los datos de la tecnología actual
      try {
        const response = await fetch(
          `http://${window.location.hostname}:8000/texto?tech=` + actualTech
        );

        const data = await response.json();
        setDatos(data);

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData(); // Llamar a la función para obtener los datos
    window.scrollTo(0, 0); // Hacer scroll al principio de la página

  }, [actualTech]);  // Ejecutar el hook cada vez que actualTech cambie
 
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 50 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 1 }}
    >
      <section className="firstSection">
        <h1 className="homeTitle">{datos.name}</h1>

        <section className="">
          <div className="w-full">
            <details className="bg-gray-100 rounded-md shadow-md mb-4" style={{"transition": "all 0.3s"}}>
              <summary className="cursor-pointer bg-orange-500 text-white font-semibold p-2 rounded-md">
                Ver información
              </summary>
              <div className="p-4">
                {datos.paragraphs?.map((paragraph, index) => (
                  <p key={index} className="textoTech my-2">
                    {paragraph}
                  </p>
                ))}
              </div>
            </details>
          </div>

          <Cuestionario tech={datos?.tech} language={datos?.language} />
        </section>
      </section>
    </motion.div>
  );
}

export default Tech;
