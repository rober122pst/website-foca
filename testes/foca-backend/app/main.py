from fastapi import APIRouter
from app.routes.user import router

app = APIRouter()

app.include_router(router)