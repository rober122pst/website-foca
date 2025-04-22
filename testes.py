while True:
    print("Welcome to the VW and rem converter!")
    pixels = float(input("Enter the number of pixels: "))
    vw = (pixels*(2/3))/19.2
    rem = (pixels*(1/3))/16
    print(f"The number of vw is: {vw:.2f}")

    print(f"The number of rem is: {rem:.2f}")