def individual_serial(todo) -> dict:
    return {
        "id": str(todo["_id"]),
        "nome": todo["nome"],
        "descricao": todo["descricao"],
        "preco": todo["preco"]
    }

def list_serial(todos) -> list:
    return[individual_serial(todo) for todo in todos]