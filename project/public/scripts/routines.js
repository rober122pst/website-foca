function editRoutine() {
    document.getElementById("popup").style.display = "flex";
}

function fecharEditarRotina() {
    document.getElementById("popup").style.display = "none";
}

function toggleDia(button) {
    button.classList.toggle("escolhido");
}