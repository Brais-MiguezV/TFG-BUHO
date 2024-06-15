import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

function LateralNav() {
  const [datos, setDatos] = useState([]);
  const location = useLocation();

  const locationSplit = location.pathname.split("/");

  const actualTech = locationSplit[locationSplit.length - 1];



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://51.21.134.236:8000/tecnologias");
        const data = await response.json();
        setDatos(data);

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);


  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 50 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 1 }}
    >
      <Sidebar className="navBar">
        <Sidebar.Items className="">
          <Sidebar.ItemGroup className="">
            {datos?.map((element, index) => (
              <Link to={"/tech/" + element.tech} key={element.tech}>
                <Sidebar.Item
                  key={element.tech}
                  className={
                    element.tech === actualTech
                      ? "navBarLink seleccionado"
                      : "navBarLink"
                  }
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img
                    src={process.env.PUBLIC_URL + "/icons/" + element.icon}
                    alt={"logo de " + element.name}
                    className="navBarImage"
                  />
                  <p className="ml-6"> {element.name} </p>
                </Sidebar.Item>
              </Link>
            ))}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </motion.div>
  );
}

export default LateralNav;
