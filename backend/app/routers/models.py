from typing import Optional

from pydantic import BaseModel


class Question(BaseModel):
    id: int  # Identificador de la pregunta
    preText: str  # Texto previo a la pregunta
    text: str  # Texto de la pregunta
    answers: list  # Lista de respuestas
    last: bool  # Indica si es la última pregunta
    notes: Optional[str] = None  # Notas de la pregunta
    command: list  # Comando de la pregunta


class TextInit(BaseModel):
    tech: str  # Tecnología
    paragraphs: list  # Lista de párrafos
    image: str  # Imagen de la tecnología
    icon: str  # Icono de la tecnología
    name: str  # Nombre de la tecnología
    language: str  # Lenguaje de la tecnología
    
    
class EmailSchema(BaseModel):
    subject: str  # Asunto del correo
    body: str  # Cuerpo del correo
    sender: str  # Remitente
