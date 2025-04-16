# Pomodoro Session model
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Session(BaseModel):
    id: Optional[str]
    inicio: datetime
    fim: datetime
    tempo_total: int
    usuario_id: str
    xp_ganho: int
