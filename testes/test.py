import requests

response = requests.post("http://127.0.0.1:8000/user", json={"nome": "Felipe", "descricao": "string", "preco": 2.0})
print(response)