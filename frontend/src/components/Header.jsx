import React from "react";
import logo from "../logo.png";
import { motion } from "framer-motion";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 50 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 1 }}
    >
      <header className="header">
        <Link to="/">
          <div className="logo">
            <img src={logo} alt="Logo de la página" className="" />
          </div>
        </Link>

        <Link to="/">
          <h1>BUHO</h1>
        </Link>

        <Link to="/contact" className="headerBut" >
          <button className="">Contacto</button>
        </Link>
      </header>
    </motion.div>
  );
}

export default Header;
