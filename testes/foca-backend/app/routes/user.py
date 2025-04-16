from fastapi import APIRouter
from app.models.user import Item
from app.core.db import collection_name
from app.schemas.user import list_serial
from bson import ObjectId

router = APIRouter()

@router.get("/user")
async def get_todos(nome: str = None):
    todos = list_serial(collection_name.find({"nome": nome} if nome else None))
    return todos

@router.post("/user")
async def post_todo(todo: Item):
    collection_name.insert_one(dict(todo))
