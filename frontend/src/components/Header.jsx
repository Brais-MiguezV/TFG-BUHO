import React from "react";
import logo from "../logo.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

        <Link to="/contact" className="headerBut">
          <button className="">
            <FontAwesomeIcon icon="fa-regular fa-comments" />
          </button>
        </Link>
      </header>
    </motion.div>
  );
}

export default Header;
