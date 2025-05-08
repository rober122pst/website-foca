const token = localStorage.getItem('token') || sessionStorage.getItem('token'); // Tenta obter o token do localStorage ou sessionStorage
if (token) { // Função para verificar se o token existe
  window.location.href = '/dashboard';
} // Redireciona para a página de dashboard se o token existir
// Se não existir, continua na página de login

document.querySelectorAll("form").forEach((form) => {
    const inputs = form.querySelectorAll(".input-field");
    
    function updateButtonProgress() {
        const progressFill = form.querySelector(".progress-fill");
        const progressText = form.querySelector(".progress-fill-text");
        const submitLoginButton = form.querySelector(".login-button")
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
    
    form.addEventListener("submit", async function (e) {
        e.preventDefault()
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
    const tudoValido = regrasValidacaoLogin.every(({ campo, regra, mensagem, span }) => {
        const campoElement = document.getElementById(campo);
        return aplicarValidacaoAoCampo(campoElement, regra, mensagem, span); // Aplica a validação e retorna true ou false
    });
    if (tudoValido) // Se todos os campos forem válidos
        login();
}

function submitRegister() {
    console.log('submitRegister')
    const tudoValido = regrasValidacaoRegister.every(({ campo, regra, mensagem, span }) => {
        const campoElement = document.getElementById(campo);
        return aplicarValidacaoAoCampo(campoElement, regra, mensagem, span); // Aplica a validação e retorna true ou false
    });
    console.log(tudoValido)
    if (tudoValido) // Se todos os campos forem válidos
        register();
}

function validarCampoAoDigitar(campo, regraValidacao, mensagemErro, span) {
    campo.addEventListener('blur', () => {
        aplicarValidacaoAoCampo(campo, regraValidacao, mensagemErro, span);
    });
}

function aplicarValidacaoAoCampo(campo, regraValidacao, mensagemErro, span) {
    const valido = regraValidacao(campo.value, campo)
    if (!valido) {
        span.textContent = mensagemErro;
        campo.classList.add('error'); // Adiciona a classe de erro ao 
        return false;
    } else {
        span.textContent = '';
        campo.classList.remove('error'); // Remove a classe de erro do campo
        return true;
    }
}

const regrasValidacaoRegister = [
    { campo: 'nickname', regra: (value) => value.length >= 3, mensagem: 'Por favor, insira um nome com mais de 3 caracteres.', span: document.getElementById('response-register') },
    { campo: 'email-register', regra: (value) => validateEmail(value), mensagem: 'Por favor, insira um email válido.', span: document.getElementById('response-register') },
    { campo: 'senha-register', regra: (value) => value.length >= 6, mensagem: 'A senha deve ter pelo menos 6 caracteres.', span: document.getElementById('response-register') },
    { campo: 'senha-confirm', regra: (value) => value === document.getElementById('senha-register').value, mensagem: 'As senhas não coincidem.', span: document.getElementById('response-register') },
    { campo: 'termos-servicos', regra: (value, campo) => campo.checked, mensagem: 'Você deve aceitar os termos de serviço.', span: document.getElementById('response-register') }, 
]

const regrasValidacaoLogin = [
    { campo: 'email-login', regra: (value) => validateEmail(value), mensagem: 'Por favor, insira um email válido.', span: document.getElementById('response-login') },
]

regrasValidacaoRegister.forEach(({ campo, regra, mensagem, span }) => {
    validarCampoAoDigitar(document.getElementById(campo), regra, mensagem, span);
});
regrasValidacaoLogin.forEach(({ campo, regra, mensagem, span }) => {
    validarCampoAoDigitar(document.getElementById(campo), regra, mensagem, span);
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

const urlParams = new URLSearchParams(window.location.search);
if(urlParams.get('register')) {
    toggleForm()
}

function toggleForm() {
    const wrapperLogin = document.querySelector(".wrapper-login");
    wrapperLogin.classList.toggle("active");
}

const API_URL = `https://foca.onrender.com/api/auth`

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
    if (res.ok) { // verifica se o registro foi bem sucedido
        localStorage.setItem('lastRegisteredEmail', email); // armazena o token no sessionStorage
        window.location.href = '/auth/verify'; // redireciona para a página de verificação
    } else {
        document.getElementById('response-register').textContent = data.error;
    }
}

async function login() { // função de login
    const email_element = document.getElementById('email-login');
    const password_element = document.getElementById('senha-login');
    const remember = document.getElementById('remember-me');

    const email = email_element.value.trim();
    const password = password_element.value;

    const res = await fetch(`${API_URL}/login`, { // faz a requisição para o backend
        // o backend vai verificar se o usuário existe e se a senha está correta
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) { // verifica se o login foi bem sucedido
        // Armazena o token no localStorage ou sessionStorage, dependendo da opção "Lembrar-me"
        if (remember.checked) {
            localStorage.setItem('token', data.token); // fica salvo mesmo após fechar o navegador
        } else {
            sessionStorage.setItem('token', data.token); // some quando fecha o navegador
        }
        window.location.href = '/dashboard';
    } else {
        if (res.status === 400) {
            email_element.classList.add('error'); // Adiciona a classe de erro ao campo de email
        }
        else if (res.status === 401) {
            password_element.classList.add('error'); // Adiciona a classe de erro ao campo de senha
        }
        document.getElementById('response-login').textContent = data.message || data.error;
    }
}