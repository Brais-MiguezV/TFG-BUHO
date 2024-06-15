from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import funcionesCuestionario
 
app = FastAPI()  # Creación de la aplicación

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)  # Configuración de CORS

app.include_router(funcionesCuestionario.router)  # Inclusión de las rutas
