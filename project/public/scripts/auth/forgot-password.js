const urlParams = new URLSearchParams(window.location.search);

document.getElementById('resetForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // evita que o form recarregue a página

    const email = document.getElementById('email').value;
    console.log('Requisitando com:', email);

    try {
        const res = await fetch('http://localhost:3000/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await res.json();
        console.log(data)
        // Salva o email na URL pra depois identificar
        const url = new URL(window.location.href);
        url.searchParams.set('email', email);
        window.history.pushState({}, '', url);
        mudarHTML();
    } catch (err) {
        console.error(err);
    }
});
async function mudarHTML() {
    document.querySelector('.container').innerHTML = `
        <i class="fa-solid fa-key"></i>
        <h1>Email enviado!</h1>
        <p>Clique no link de recuperação de senha enviado para o seu email!<br><br>Não esqueça de verificar sua caixa de spam em?</p>
    `
}
window.addEventListener('DOMContentLoaded', async () => {
    if(urlParams.get("email")) mudarHTML();
});

