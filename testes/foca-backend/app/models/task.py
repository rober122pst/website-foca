# Task model
from pydantic import BaseModel
from typing import Optional

class Task(BaseModel):
    id: Optional[str]
    titulo: str
    concluida: bool = False
    prioridade: Optional[str] = "normal"
    usuario_id: str
