# while True:
#     print("Welcome to the VW and rem converter!")
#     pixels = float(input("Enter the number of pixels: "))
#     vw = (pixels*(1/3))/19.2
#     rem = (pixels*(2/3))/16
#     print(f"The number of vw is: {vw:.2f}")

#     print(f"The number of rem is: {rem:.2f}")

def calcular_vw_ideal(min_rem, rem_offset, max_rem, target_width_px, base_rem_px=16):
    min_px = min_rem * base_rem_px
    max_px = max_rem * base_rem_px
    offset_px = rem_offset * base_rem_px

    # Calcula o valor de vw necessário
    vw_ideal = (max_px - offset_px) / target_width_px * 100  # pois 1vw = 1% da largura
    print("\n=== RESULTADO ===")
    print(f"🧠 Para bater {max_px}px ({max_rem}rem) em uma tela de {target_width_px}px,")
    print(f"➡️  você deve usar: clamp({min_rem}rem, {vw_ideal:.3f}vw + {rem_offset}rem, {max_rem}rem)")
    print(f"🔹 MIN: {min_px}px")
    print(f"🔸 MAX: {max_px}px")
    print(f"🎯 Valor calculado de vw: {vw_ideal:.3f}vw\n")


def main():
    print("💡 CALCULADORA DE CLAMP RESPONSIVO (vw ideal)")

    try:
        min_rem = float(input("➡️  Valor MÍNIMO (rem): "))
        rem_offset = float(input("➡️  Valor fixo em REM (offset): "))
        max_rem = float(input("➡️  Valor MÁXIMO (rem): "))
        target_width_px = float(input("➡️  Largura da tela alvo (em px): "))
        base_rem_px = float(input("➡️  Quanto vale 1rem em px? (padrão: 16): ") or 16)

        calcular_vw_ideal(min_rem, rem_offset, max_rem, target_width_px, base_rem_px)

    except ValueError:
        print("❌ Digita número aí, mermão.")

if __name__ == "__main__":
    while True:
        main()
        continuar = input("➡️  Deseja calcular outro valor? (s/n): ").strip().lower()
        if continuar != 's':
            print("👋 Até mais!")
            break


from plyer import notification

notification.notify()