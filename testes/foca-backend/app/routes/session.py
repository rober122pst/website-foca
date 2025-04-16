# Session routes
from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_sessions():
    return {"message": "Listagem de sessões Pomodoro"}
