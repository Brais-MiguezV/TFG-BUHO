import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";


function Contact() {
  const navigate  = useNavigate(); // Hook para navegar entre páginas

  const sendEmail = async (event) => { // Función para enviar el email
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const name = document.getElementById("name").value; // Obtener el valor del campo nombre
    const email = document.getElementById("email").value; // Obtener el valor del campo email
    const message = document.getElementById("message").value; // Obtener el valor del campo mensaje

    if (name === "" || email === "" || message === "") { // Si alguno de los campos está vacío
      alert("Por favor, rellena todos los campos"); // Mostrar un mensaje de alerta
      return; // Salir de la función
    }

    const emailData = { // Datos del email
      subject: "Sugerencia de BUHO", // Asunto del email
      sender: email, // Remitente del email
      body: ` 
                Nombre: ${name} 
                Email: ${email}
                Mensaje: ${message}
            `,
    };

    try {
      const response = await fetch(`http://${window.location.hostname}:8000/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      }); // Enviar el email

      if (response.ok) { 
        alert("Email enviado con éxito"); // Mostrar mensaje de éxito
      } else {
        alert("Error al enviar el email"); // Mostrar mensaje de error
      }

    } catch (error) {
      console.error("Error sending email: ", error); // Mostrar error en consola
      alert("Error al enviar el email"); // Mostrar mensaje de error
    }
  };

  const [datos, setDatos] = useState([]); // Estado para almacenar los datos de las tecnologías

  useEffect(() => { // Hook para obtener los datos de las tecnologías
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${window.location.hostname}:8000/tecnologias`); // Obtener los datos de las tecnologías
        if (response.status === 404) {
          navigate('/404')
          return;
        }
        const data = await response.json();
        setDatos(data);

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData(); // Llamar a la función para obtener los datos

    window.scrollTo(0, 0); // Hacer scroll al principio de la página

  }, []); // Ejecutar el hook solo una vez

  return (
    <section className="firstSection">
      <h1 className="homeTitle differentFont">
        ¡Ponte en contacto con nosotros!
      </h1>

      <p>
        Igual que todas las tecnologías en las que puedes pensar, BUHO necesita
        actualizaciones y mejoras. Si tienes alguna idea, sugerencia o
        simplemente quieres saludar, no dudes en escribirnos a través del
        siguiente formulario:
      </p>

      <section className="contact">
        <form action="" className="contactForm">
          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="seleccion">
            ¿Sobre que quieres hablar o sugerir?
          </label>
          <select name="seleccion" id="seleccion">
            <option value="sugerencia">Sugerencia</option>
            <option value="general">General</option>
            <option value="error">Error</option>
            {(datos || [])?.map((element, index) => (
              <option value={element.tech} key={element.tech}>
                {element.name}
              </option>
            ))}
          </select>

          <label htmlFor="message">Mensaje:</label>
          <textarea
            name="message"
            id="message"
            cols="30"
            rows="10"
            required
          ></textarea>

          <button
            type="submit"
            className="buttonContact"
            onClick={(e) => sendEmail(e)}
          >
            Enviar
          </button>
        </form>
      </section>
    </section>
  );
}

export default Contact;
