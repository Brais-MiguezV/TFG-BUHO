from typing import Optional

from pydantic import BaseModel, EmailStr


class Question(BaseModel):
    id: int
    preText: str
    text: str
    answers: list
    last: bool
    notes: Optional[str]
    command: list


class TextInit(BaseModel):
    tech: str
    paragraphs: list
    image: str
    icon: str
    name: str
    language: str
    
    
class EmailSchema(BaseModel):
    subject: str
    body: str
    sender: str
