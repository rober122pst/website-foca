
const API_URL = `https://foca.onrender.com/api/auth`
window.addEventListener('DOMContentLoaded', async () => {
    const email = localStorage.getItem('lastRegisteredEmail'); // você salva o email lá no login/cadastro
    if (!email) {
        // Sem e-mail no localStorage? Vaza!
        window.location.href = '/auth';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/check-verification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (data.error || data.notFound || data.verified) {
            // Conta apagada, não encontrada ou já verificada = volta pro login/dashboard
            window.location.href = data.verified ? '/dashboard' : '/login';
        }
    } catch (e) {
        console.error('Erro ao verificar status do e-mail', e);
    // Evita travar a página
    }

    if (urlParams.has('token')) {
        fetch('verify-email.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('container').innerHTML = html;
            verifyEmail();
        })
        .catch(error => {
            console.error('Erro ao carregar a página:', error);
        });
    }
});

async function verifyEmail() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const message = document.getElementById('msg')
    const description = document.getElementById('description')

    if(!token) {
        message.textContent = 'Token não encontrado'
        return
    }

    try {
        const res = await fetch(`${API_URL}/verify?token=${token}`)
        const text = await res.text()

        if(res.ok) {
            message.textContent = text;
            description.textContent = `Sua conta foi ativada com sucesso. Você já pode fazer login e começar a focar!\n\nSe não for redirecionado, clique no botão abaixo.`
            localStorage.removeItem('lastRegisteredEmail')
            setTimeout(() => {
                window.location.href = '/auth';
            }, 3000);
        }else {
            message.textContent = text;
            description.textContent = 'Sua conta não foi encontrada. Por favor, registre-se novamente.'
        }
    } catch(err) {
        message.textContent = "Erro ao conectar com o servidor."
    }
}

async function resendEmail() {
    const email = localStorage.getItem('lastRegisteredEmail');

    if (!email) {
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/auth/resend-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

    } catch (err) {
        console.error(err)
    }
}

function irLogin() {
    window.location.href = '/auth'
}