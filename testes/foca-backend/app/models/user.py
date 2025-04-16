from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Item(BaseModel):
    nome: str
    descricao: Optional[str] = None
    preco: float