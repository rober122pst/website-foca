# import psutil
# import time
# from plyer import notification

# # Nome do processo (você pode mudar para o programa que quiser)
# ALVO = "notepad.exe"  # exemplo: bloco de notas

# # Flag pra saber se a notificação já foi enviada
# notificado = False

# try:
#     while True:
#         # Lista todos os processos ativos
#         processos = [proc.name() for proc in psutil.process_iter()]
        
#         if ALVO in processos:
#             if not notificado:
#                 notification.notify(
#                     title="Programa detectado!",
#                     message=f"O programa '{ALVO}' foi aberto.",
#                     timeout=5  # segundos
#                 )
#                 notificado = True
#         else:
#             notificado = False

#         time.sleep(2)
# except KeyboardInterrupt:
#     input("Tem certeza que quer sair? ")