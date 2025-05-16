const urlParams = new URLSearchParams(window.location.search);

document.getElementById('resetForm').addEventListener('submit', async function (e) {
    e.preventDefault()
});

async function resetPassword() {
    const newPassword = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const response = document.getElementById('response');
    const token = urlParams.get('token') || ''

    if(newPassword.length < 6) {
        response.textContent = 'A senha precisa conter 6 ou mais caracteres.'
        return
    }
    else if(newPassword !== passwordConfirm) {
        response.textContent = 'As senhas não coincidem.'
        return
    }
    else {
        response.textContent = ''
    }

    const res = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
    });
    data = await res.json()
    if(res.ok) {
        document.getElementById('resetForm').style.display = 'none'
        document.querySelector('.container').querySelector('h1').textContent = data.message || data.error
        document.querySelector('.container').querySelector('p').textContent = "Anote a senha em algum lugar e retorne a tela de login!"
    }else {
        document.getElementById('resetForm').style.display = 'none'
        document.querySelector('.container').querySelector('h1').textContent = data.message || data.error
        document.querySelector('.container').querySelector('p').textContent = "Solicite outro email de redefinição de senha."
    }
}
