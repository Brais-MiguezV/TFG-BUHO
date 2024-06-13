import React from "react";
import Home from "./Home";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Tech from "./Tech";
import Contact from "./Contact";
import {ScrollRestoration} from "react-router-dom";

function Pages() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} /> {/*// this is the default route*/}
        <Route path="/tech/:tech" element={<Tech />} />
        <Route path="contact" element={<Contact />} />
     
      </Routes>
    </AnimatePresence>
  );
}

export default Pages;
