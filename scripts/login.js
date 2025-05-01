const token = localStorage.getItem('token') || sessionStorage.getItem('token'); // Tenta obter o token do localStorage ou sessionStorage
if (token) { // Função para verificar se o token existe
  window.location.href = '../dashboard.html';
} // Redireciona para a página de dashboard se o token existir
// Se não existir, continua na página de login

document.querySelectorAll("#form").forEach((form) => {
    const inputs = form.querySelectorAll(".input-field");
    const progressFill = form.querySelector(".progress-fill");
    const progressText = form.querySelector(".progress-fill-text");
    const submitLoginButton = form.querySelector(".login-button")

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
});

function toggleSenha(id, iconClicked) {
    const input = document.getElementById(id);
    console.log(input)
    input.type = input.type === "password" ? "text" : "password";
    const label = iconClicked.closest("label");
    const visible = label.querySelector(".visible");
    const invisible = label.querySelector(".invisible");
    if (input.type === "text") {
        visible.style.display = "block";
        invisible.style.display = "none";
    } else {
        visible.style.display = "none";
        invisible.style.display = "block";
    }
}

function submitLogin() {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('senha-login').value; 
    
    if (!validateEmail(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }
    else {
        login();
    }

}

function submitRegister() {
    const email = document.getElementById('email-register').value;
    const password = document.getElementById('senha-register').value; 
    const password_cofirm = document.getElementById('senha-cofirm').value; 
    const username = document.getElementById('nickname').value;

    if (username.length < 3) {
        alert('O nome de usuário deve ter pelo menos 3 caracteres.');
        return;
    }
    else if (!validateEmail(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }
    else if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    } else if (password !== password_cofirm) {
        alert('As senhas não coincidem.');
        return;
    }
    else {
        register();
    }

}


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function toggleForm() {
    const wrapperLogin = document.querySelector(".wrapper-login");
    wrapperLogin.classList.toggle("active");
}

const API_URL = 'http://localhost:3000/auth';

async function register() { // função de registro
    const username = document.getElementById('nickname').value;
    const email = document.getElementById('email-register').value;
    const password = document.getElementById('senha-register').value;

    const res = await fetch(`${API_URL}/register`, { // faz a requisição para o backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    console.log(data); // imprime a resposta do backend no console
    // document.getElementById('response').textContent = data.message || data.error;

    if (res.ok) { // verifica se o registro foi bem sucedido
        document.getElementById('response').textContent = `Usuário ${username} criado com sucesso!`;
        sessionStorage.setItem('token', data.token); // armazena o token no sessionStorage
        setTimeout(() => {
            window.location.href = '../dashboard.html'; // redireciona para a página de login após 2 segundos
        }, 2000);
    } else {
        document.getElementById('response').textContent = data.message || data.error;
    }
}

async function login() { // função de login
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('senha-login').value;
    const remember = document.getElementById('remember-me').checked;

    const res = await fetch(`${API_URL}/login`, { // faz a requisição para o backend
        // o backend vai verificar se o usuário existe e se a senha está correta
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) { // verifica se o login foi bem sucedido
        // Armazena o token no localStorage ou sessionStorage, dependendo da opção "Lembrar-me"
        if (remember) {
            localStorage.setItem('token', data.token); // fica salvo mesmo após fechar o navegador
        } else {
            sessionStorage.setItem('token', data.token); // some quando fecha o navegador
        }
        window.location.href = '../dashboard.html';
    } else {
        document.getElementById('response').textContent = data.message || data.error;
    }
}