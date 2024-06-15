import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cuestionario from "../components/Cuestionario";
import { motion } from "framer-motion";

function Tech() {
  const location = useLocation();

  const locationSplit = location.pathname.split("/");

  const actualTech = locationSplit[locationSplit.length - 1];

  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://51.21.134.236:8000/texto?tech=" + actualTech
        );
        const data = await response.json();
        setDatos(data);

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [actualTech]);

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
          {datos.paragraphs?.map((paragraph, index) => {
            return <p key={index} className="textoTech">{paragraph}</p>;
          })}

        <Cuestionario tech={datos?.tech} language={datos?.language}/>

        </section>

        
      </section>
    </motion.div>
  );
}

export default Tech;
