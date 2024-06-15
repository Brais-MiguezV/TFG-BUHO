from fastapi import APIRouter, HTTPException
from typing import List

from .database import db
from .models import Question, TextInit, EmailSchema

import smtplib
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

router = APIRouter()


@router.get(
    "/primerapregunta",
    response_model=Question,
    description="This endpoint returns the firts question of a given tech",
)
async def get_question(tech: str = ""):
    try:
        if tech not in await db.list_collection_names(): # Comprueba si la colección existe
            raise HTTPException(
                status_code=404, detail=f"La colección con el nombre {tech} no existe"
            ) # Devuelve un error 404 si no existe la colección

        pregunta: Question = await db[tech].find_one(sort=[("id", 1)]) # Busca la primera pregunta de la colección

        if not pregunta: # Si no hay preguntas en la colección
            raise HTTPException(
                status_code=404, detail="No existen objetos en la colección"
            ) # Devuelve un error 404

        return pregunta # Devuelve la pregunta
    
    except HTTPException as http_exc: # Si hay un error HTTP
        raise http_exc # Devuelve el error
    
    except Exception as e: # Si hay un error
        print(f"Ha ocurrido un error: {e}") # Imprime el error
        raise HTTPException(status_code=500, detail="Error interno del servidor") # Devuelve un error 500


@router.get(
    "/siguiente",
    response_model=Question,
    description=(
        "This endpoint returns the next question "
        + "using the tech and the id of the given question and the answer"
    ),
)
async def get_next(tech: str = "", actual: int = 0, answer: int = 0):
    try:
        if tech not in await db.list_collection_names(): # Comprueba si la colección existe
            raise HTTPException(
                status_code=404, detail=f"La colección con el nombre {tech} no existe"
            ) # Devuelve un error 404 si no existe la colección

        if actual == 0 or answer == 0: # Si no se ha especificado la pregunta actual o la respuesta
            raise HTTPException(
                status_code=400,
                detail="Se debe indicar el id de la pregunta actual y la respuesta a la misma",
            ) # Devuelve un error 400 de petición incorrecta

        actualQuestion: Question = await db[tech].find_one({"id": actual}) # Busca la pregunta actual

        if not actualQuestion: # Si no existe la pregunta actual
            raise HTTPException(
                status_code=404, detail=f"No existe una pregunta con el id {actual}"
            ) # Devuelve un error 404

        if actualQuestion["last"]: # Si es la última pregunta
            return actualQuestion # Devuelve la pregunta actual
        
        else: # Si no es la última pregunta
            nextId = -1 # Inicializa el id de la siguiente pregunta
            for ans in actualQuestion["answers"]: # Recorre las respuestas de la pregunta actual
                if ans["id"] == answer: # Si la respuesta coincide con la respuesta dada
                    nextId = ans["next"] # Asigna el id de la siguiente pregunta

            if nextId == -1: # Si no se ha encontrado la respuesta
                raise HTTPException(
                    status_code=404,
                    detail=f"La respuesta a la pregunta con el id {actual} no es válida",
                ) # Devuelve un error 404
                
            nextQuestion: Question = await db[tech].find_one({"id": nextId}) # Busca la siguiente pregunta

            if not nextQuestion: # Si no existe la siguiente pregunta
                raise HTTPException(
                    status_code=404, detail=f"No existe una pregunta con el id {nextId}"
                ) # Devuelve un error 404

            return nextQuestion # Devuelve la siguiente pregunta

    except HTTPException as http_exc: # Si hay un error HTTP
        raise http_exc # Devuelve el error
    except Exception as e:
        print(f"Ha ocurrido un error: {e}") # Imprime el error
        raise HTTPException(status_code=500, detail="Error interno del servidor") # Devuelve un error 500


@router.get(
    "/tecnologias", response_model=List[TextInit], description="This endpoint returns the list of available technologies"
) 
async def get_list():
    """
    This endpoint returns the list of available collections without the collection 'misc'
    """
    lista_cursor = db["misc"].find() # Get all the collections
    lista = await lista_cursor.to_list(length=100)  # Convert the cursor to a list

    if not lista: # If there are no collections
        raise HTTPException(status_code=404, detail="La base de datos está caída") # Return a 404 error

    return lista   # Return the list of collections


@router.get(
    "/texto",
    response_model=TextInit,
    description="This endpoint returns the intro text for the given technology",
)
async def get_text(tech: str = ""):
    if tech == "" or tech is None: # Si no se ha especificado una tecnología
        raise HTTPException(
            status_code=400, detail="Se debe especificar una tecnología"
        ) # Devuelve un error 400 de petición incorrecta

    texto: TextInit = await db["misc"].find_one({"tech": tech}) # Busca el texto de introducción de la tecnología

    if not texto: # Si no se ha encontrado el texto
        raise HTTPException(
            status_code=404,
            detail="No se ha encontrado la tecnología en la base de datos",
        ) # Devuelve un error 404

    return texto # Devuelve el texto de introducción de la tecnología especificada si se ha encontrado


@router.get(
    "/pregunta",
    response_model=Question,
    description="This endpoint returns the question with the id and the proper tech",
)
async def get_Onequestion(tech: str = "", id: int = 0):
    try:
        if tech not in await db.list_collection_names(): # Comprueba si la colección existe
            raise HTTPException(
                status_code=404, detail=f"La colección con el nombre {tech} no existe"
            ) # Devuelve un error 404 si no existe la colección

        pregunta: Question = await db[tech].find_one({"id": id}) # Busca la pregunta con el id especificado

        if not pregunta: # Si no se ha encontrado la pregunta
            raise HTTPException(
                status_code=404, detail="No se ha encontrado la pregunta"
            ) # Devuelve un error 404

        return pregunta # Devuelve la pregunta
    
    except HTTPException as http_exc: # Si hay un error HTTP
        raise http_exc # Devuelve el error
    
    except Exception as e: # Si hay un error
        print(f"Ha ocurrido un error: {e}") # Imprime el error
        raise HTTPException(status_code=500, detail="Error interno del servidor") # Devuelve un error 500


@router.post(
    "/send-email",
    response_model=dict,
    description="This endpoint sends an email to the admin",
)
async def send_email(email_data: EmailSchema):
    try:
        msg = EmailMessage() # Crear un objeto EmailMessage
        msg.set_content(
            f"""
        {email_data.body}
        """
        ) # Añadir el cuerpo del mensaje

        msg["Subject"] = email_data.subject # Añadir el asunto del mensaje
        msg["From"] = email_data.sender # Añadir el remitente del mensaje
        msg["To"] = "adbuho@gmail.com" # Añadir el destinatario del mensaje
        
        msg = msg.as_string() # convertir msg a string

        smtp_server = "smtp.gmail.com" # Servidor SMTP
        smtp_port = 587 # Puerto SMTP
        usuario = "adbuho@gmail.com" # Usuario
        contraseña = "jetq afxw tunk wobo" # Contraseña

        servidor = smtplib.SMTP(smtp_server, smtp_port) # Conectar al servidor SMTP
        servidor.starttls()  # Iniciar la comunicación segura
        servidor.login(usuario, contraseña) # Iniciar sesión en el servidor SMTP
        servidor.sendmail(to_addrs="adbuho@gmail.com", msg=msg, from_addr=email_data.sender) # Enviar el correo
        servidor.quit() # Cerrar la conexión
        
        print(f"Correo enviado exitosamente a {usuario}") # Imprimir mensaje de éxito

        return {"message": "Correo enviado exitosamente"} # Devolver mensaje de éxito

    except Exception as e: # Si hay un error
        print(f"Error al enviar el correo: {e}") # Imprimir el error
        raise HTTPException(status_code=500, detail=str(e)) # Devolver un error 500
