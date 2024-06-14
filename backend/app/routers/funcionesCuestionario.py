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
        if tech not in await db.list_collection_names():
            raise HTTPException(
                status_code=404, detail=f"La colección con el nombre {tech} no existe"
            )

        pregunta: Question = await db[tech].find_one(sort=[("id", 1)])

        if not pregunta:
            raise HTTPException(
                status_code=404, detail="No existen objetos en la colección"
            )

        return pregunta
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"Ha ocurrido un error: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")


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
        if tech not in await db.list_collection_names():
            raise HTTPException(
                status_code=404, detail=f"La colección con el nombre {tech} no existe"
            )

        if actual == 0 or answer == 0:
            raise HTTPException(
                status_code=400,
                detail="Se debe indicar el id de la pregunta actual y la respuesta a la misma",
            )

        actualQuestion: Question = await db[tech].find_one({"id": actual})

        if not actualQuestion:
            raise HTTPException(
                status_code=404, detail=f"No existe una pregunta con el id {actual}"
            )

        if actualQuestion["last"]:
            return actualQuestion
        else:
            nextId = -1
            for ans in actualQuestion["answers"]:
                if ans["id"] == answer:
                    nextId = ans["next"]

            if nextId == -1:
                raise HTTPException(
                    status_code=404,
                    detail=f"La respuesta a la pregunta con el id {actual} no es válida",
                )
            nextQuestion: Question = await db[tech].find_one({"id": nextId})

            if not nextQuestion:
                raise HTTPException(
                    status_code=404, detail=f"No existe una pregunta con el id {nextId}"
                )

            return nextQuestion

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"Ha ocurrido un error: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")


@router.get(
    "/tecnologias", response_model=List[TextInit]
)  # Adjust the response model as needed
async def get_list():
    """
    This endpoint returns the list of available collections without the collection 'misc'
    """
    lista_cursor = db["misc"].find()
    lista = await lista_cursor.to_list(length=100)  # Adjust the length as needed

    if not lista:
        raise HTTPException(status_code=404, detail="La base de datos está caída")

    return lista


@router.get(
    "/texto",
    response_model=TextInit,
    description="This endpoint returns the intro text for the given technology",
)
async def get_text(tech: str = ""):
    if tech == "" or tech is None:
        raise HTTPException(
            status_code=400, detail="Se debe especificar una tecnología"
        )

    texto: TextInit = await db["misc"].find_one({"tech": tech})

    if not texto:
        raise HTTPException(
            status_code=404,
            detail="No se ha encontrado la tecnología en la base de datos",
        )

    return texto


@router.get(
    "/pregunta",
    response_model=Question,
    description="This endpoint returns the question with the id and the proper tech",
)
async def get_Onequestion(tech: str = "", id: int = 0):
    try:
        if tech not in await db.list_collection_names():
            raise HTTPException(
                status_code=404, detail=f"La colección con el nombre {tech} no existe"
            )

        pregunta: Question = await db[tech].find_one({"id": id})

        if not pregunta:
            raise HTTPException(
                status_code=404, detail="No se ha encontrado la pregunta"
            )

        return pregunta
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"Ha ocurrido un error: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")


@router.post(
    "/send-email",
    response_model=dict,
    description="This endpoint sends an email to the admin",
)
async def send_email(email_data: EmailSchema):
    try:
        msg = EmailMessage()
        msg.set_content(
            f"""
        {email_data.body}
        """
        )

        msg["Subject"] = email_data.subject
        msg["From"] = email_data.sender
        msg["To"] = "adbuho@gmail.com"
        
        # convertir msg a string
        msg = msg.as_string()

        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        usuario = "adbuho@gmail.com"
        contraseña = "jetq afxw tunk wobo"

        # Conectar al servidor SMTP
        servidor = smtplib.SMTP(smtp_server, smtp_port)
        servidor.starttls()  # Iniciar la comunicación segura
        servidor.login(usuario, contraseña)
        servidor.sendmail(to_addrs="adbuho@gmail.com", msg=msg, from_addr=email_data.sender)
        servidor.quit()
        
        print(f"Correo enviado exitosamente a {usuario}")

        return {"message": "Correo enviado exitosamente"}

    except Exception as e:
        print(f"Error al enviar el correo: {e}")
        raise HTTPException(status_code=500, detail=str(e))
