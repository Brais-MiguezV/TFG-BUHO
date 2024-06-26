import React from 'react'

const Error404 = () => {
  return (
    <section className="firstSection">
        <h1 className="homeTitle">
          Parece que ha habido un error.
        </h1>

        <p>
            Parece que la tecnología que buscas no se encuentra disponible aún. Si crees que debería estarlo ponte en contacto con nosotros utilizando el formulario de la página <a href="/contact" className="orange">contacto</a>.
            </p>

        <p>
            Para volver a la página principal, haz click <a href="/" className="orange">aquí</a>.
        </p>
    </section>
  )
}

export default Error404