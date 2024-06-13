from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import funcionesCuestionario

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(funcionesCuestionario.router)