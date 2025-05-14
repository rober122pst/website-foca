const token = localStorage.getItem("token") || sessionStorage.getItem("token")

async function mudarTema() {

    const fotFoca = document.querySelector(".logo-container img")
    console.log(fotFoca)
    document.body.classList.toggle("dark-mode");
    
    fotFoca.src = document.body.classList.contains("dark-mode") ? '/imgs/foca_texto_branco.png' : '/imgs/foca_texto.svg'
    console.log(document.body.classList.contains("dark-mode"))
}

document.addEventListener('DOMContentLoaded', async function() {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    user = await getUser(token);

    if(user.preferences.theme === "dark") {
        document.body.classList.add("dark-mode");
        document.querySelector(".logo-container img").src = document.body.classList.contains("dark-mode") ? '/imgs/foca_texto_branco.png' : '/imgs/foca_texto.svg'
    }
    
    const usernameEl = document.getElementById("user-name");
    usernameEl.textContent = user.username;
    const profilePicEl = document.getElementById('profile-pic');
    const coinsEl = document.getElementById('coins');
    const expBarEl = document.querySelector('.progress-fill-xp');

    let progressoXp = (user.gamification.experience/user.gamification.experienceToNextLevel)*100;

    coinsEl.textContent = `${formatarPara00_00(user.gamification.coins)} $`;
    expBarEl.style.width = `${progressoXp}%`;
    profilePicEl.src = user.profile.avatarUrl
    console.log(profilePicEl)
});

async function getUser(token) {
    try {
        const res = await fetch(`/api/user`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            }
        })
        const data = res.json();
        return data
    } catch (e) {
        console.error(e);
        return
    }
}

function formatarPara00_00(numero) {
    // Garante que o número tem duas casas decimais e arredonda se necessário
    const numeroFormatado = Number(numero).toFixed(2);
    
    // Divide em parte inteira e decimal
    const [parteInteira, parteDecimal] = numeroFormatado.split('.');
    
    // Garante que a parte inteira tenha pelo menos 2 dígitos, preenchendo com zero à esquerda
    const parteInteiraFormatada = parteInteira.padStart(2, '0');
    
    // Retorna no formato 00.00
    return `${parteInteiraFormatada},${parteDecimal}`;
}

function toggleSizeSidebar() {
    const sidebarEl = document.querySelector(".sidebar-container");
    sidebarEl.classList.toggle("small");
    sidebarEl.classList.toggle("big");

    if(sidebarEl.classList.contains("small")) {
        document.querySelector(".logo-container img").src = document.body.classList.contains("dark-mode") ? '/imgs/foca_branco.svg' : '/imgs/foca.svg'
    }else {
        document.querySelector(".logo-container img").src = document.body.classList.contains("dark-mode") ? '/imgs/foca_texto_branco.png' : '/imgs/foca_texto.svg'
    }
}