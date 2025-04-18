const form = document.getElementById("form");
const inputs = form.querySelectorAll(".input-field");
const progressFill = document.querySelector(".progress-fill");
const progressText = document.querySelector(".progress-fill-text");
const submitLoginButton = document.querySelector(".login-button")

function updateButtonProgress() {
    let filled = 0;
    inputs.forEach(input => {
        if (input.value.trim() !== "") {
            filled++;
        }
    });
    const percentage = (filled / inputs.length) * 100;
    progressFill.style.width = percentage + "%";
    progressText.style.width = percentage + "%";
    if (percentage >= 100) {
        progressFill.classList.add("complete");
        submitLoginButton.disabled = false;
    }else {
        submitLoginButton.disabled = true;
        progressFill.classList.remove("complete");
        console.log(percentage)
    }
}


inputs.forEach(input => {
    input.addEventListener("input", updateButtonProgress);
});

function toggleSenha() {
    const input = document.getElementById("senha");
    input.type = input.type === "password" ? "text" : "password";
    const visible = document.querySelector(".visible");
    const invisible = document.querySelector(".invisible");
    if (input.type === "text") {
        visible.style.display = "block";
        invisible.style.display = "none";
    } else {
        visible.style.display = "none";
        invisible.style.display = "block";
    }
}

function submitLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value; 
    
    if (!validateEmail(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }
    else if (password.length < 8) {
        alert('A senha deve ter pelo menos 8 caracteres.');
        return;
    }
    else {
        alert(`Logado com o email: ${email}`);
    }

}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}