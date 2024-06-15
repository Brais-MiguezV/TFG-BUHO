import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa"; // Import an icon for the toggle button

function LateralNav() {
  const [datos, setDatos] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 800);
  const location = useLocation();

  const locationSplit = location.pathname.split("/");
  const actualTech = locationSplit[locationSplit.length - 1];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendPort = "8000"; // Define the backend port if different from the frontend
        const apiUrl = `http://${window.location.hostname}:${backendPort}/tecnologias`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setDatos(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 687);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ position: "absolute" }}>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <FaBars />
      </button>
      <motion.div
        animate={{ x: isCollapsed ? -300 : 0 }}
        initial={{ x: -300 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 h-full z-40 bg-white shadow-lg ${
          isCollapsed ? "hidden md:block" : "block"
        }`}
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

