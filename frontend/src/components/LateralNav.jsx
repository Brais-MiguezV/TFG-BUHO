import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";

function LateralNav() {

  const [datos, setDatos] = useState([]); // Estado para almacenar los datos de las tecnologías a mostrar
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 800); // Estado para saber si el menú está colapsado
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800); // Estado para saber si la pantalla es móvil
  const location = useLocation(); // Hook para obtener la ubicación actual

  const locationSplit = location.pathname.split("/"); // Dividir la ubicación actual en partes
  const actualTech = locationSplit[locationSplit.length - 1]; // Obtener la última parte de la ubicación actual (la tecnología actual)

  useEffect(() => { // Hook para obtener los datos de las tecnologías

    const fetchData = async () => { // Función asíncrona para obtener los datos de las tecnologías
      try {
        const backendPort = "8000";
        const apiUrl = `http://${window.location.hostname}:${backendPort}/tecnologias`; // URL de la API para obtener las tecnologías
        const response = await fetch(apiUrl);
        const data = await response.json();
        setDatos(data);

      } catch (error) {
        console.error("Error fetching data: ", error); // Mostrar error en consola si no se pueden obtener los datos
      }
    };

    fetchData(); // Llamar a la función para obtener los datos
  }, []);

  useEffect(() => { // Hook para saber si la pantalla es móvil y si el menú está colapsado
    const handleResize = () => { // Función para manejar el evento de redimensionar la pantalla
      setIsMobile(window.innerWidth < 800); // Actualizar el estado de isMobile si la pantalla es menor a 800px
      if (window.innerWidth >= 800) { // Si la pantalla es mayor o igual a 800px
        setIsCollapsed(false); // Actualizar el estado de isCollapsed a false
      } 
    };

    window.addEventListener("resize", handleResize); // Añadir un evento para manejar el redimensionamiento de la pantalla

    return () => { // Función para limpiar el evento de redimensionar la pantalla
      window.removeEventListener("resize", handleResize); // Eliminar el evento de redimensionar la pantalla
    };

  }, []); // Ejecutar el hook solo una vez

  return (
    <div>
      {isMobile && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <FaBars />
        </button>
      )}
      <motion.div
        animate={{ x: isCollapsed && isMobile ? -300 : 0 }}
        initial={{ x: -300 }}
        transition={{ duration: 0.5 }}
        className={`${
          isCollapsed && isMobile ? "fixed top-0 left-0 h-full z-40 bg-white shadow-lg hidden" : "relative"
        } ${isMobile ? "" : "block md:block"}`}
        style={{ width: isMobile ? (isCollapsed ? '0' : '16rem') : 'auto' }}
      >
        <Sidebar className="navBar h-full">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              {datos?.map((element) => (
                <Link to={"/tech/" + element?.tech} key={element?.tech}>
                  <Sidebar.Item
                    key={element?.tech}
                    className={
                      element?.tech === actualTech
                        ? "navBarLink seleccionado"
                        : "navBarLink"
                    }
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/icons/" + element?.icon}
                      alt={"logo de " + element?.name}
                      className="navBarImage"
                    />
                    <p className="ml-6"> {element?.name} </p>
                  </Sidebar.Item>
                </Link>
              ))}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </motion.div>
    </div>
  );
}

export default LateralNav;
