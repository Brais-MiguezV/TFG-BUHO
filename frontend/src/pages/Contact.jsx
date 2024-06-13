import React, { useState, useEffect } from "react";

function Contact() {
  const sendEmail = async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (name === "" || email === "" || message === "") {
      alert("Por favor, rellena todos los campos");
      return;
    }

    const emailData = {
      subject: "Sugerencia de BUHO",
      sender: email,
      body: `
                Nombre: ${name}
                Email: ${email}
                Mensaje: ${message}
            `,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        alert("Email enviado con éxito");
      } else {
        alert("Error al enviar el email");
      }
    } catch (error) {
      console.error("Error sending email: ", error);
      alert("Error al enviar el email");
    }
  };

  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/tecnologias");
        const data = await response.json();
        setDatos(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []);

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
            {datos?.map((element, index) => (
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
