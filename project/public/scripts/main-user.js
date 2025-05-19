let resizeTimeout;
const token = localStorage.getItem("token") || sessionStorage.getItem("token")


document.addEventListener('DOMContentLoaded', async function() {
    if (!token) return;
    
    user = await getUser(token);

    if(user.preferences.theme === "dark") {
        document.body.classList.add("dark-mode");
        verificarLogo();
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
        const data = await res.json();
        return data
    } catch (e) {
        console.error(e);
        return
    }
}

async function getApiData(endpoint) {
    try {
        const res = await fetch(`/api/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await res.json();
        if(!res.ok) { console.error(data.message); return }
        console.log(data)
        return data
    } catch (e) {
        console.error(e);
        return
    }
}

function handleResizeDebounced() {
  clearTimeout(resizeTimeout); // Limpa o timeout anterior
  resizeTimeout = setTimeout(() => {
    const screenWidth = window.innerWidth;
    if(screenWidth <= 1590) {
        document.body.classList.add("small-sidebar");
        document.body.classList.remove("big-sidebar");

        verificarLogo()
    }
}, 200); // Espera 200ms após o último redimensionamento
}

function verificarLogo() {
    const body = document.body;
    if(body.classList.contains("small-sidebar")) {
        document.querySelector(".logo-container img").src = document.body.classList.contains("dark-mode") ? '/imgs/foca_branco.svg' : '/imgs/foca.svg'
    }else {
        document.querySelector(".logo-container img").src = document.body.classList.contains("dark-mode") ? '/imgs/foca_texto_branco.png' : '/imgs/foca_texto.svg'
    }
}

handleResizeDebounced();
window.addEventListener('resize', handleResizeDebounced);

function toggleSizeSidebar() {
    const body = document.body;
    body.classList.toggle("small-sidebar");
    body.classList.toggle("big-sidebar");

    verificarLogo()
}

async function mudarTema() {
    const fotFoca = document.querySelector(".logo-container img")
    console.log(fotFoca)
    document.body.classList.toggle("dark-mode");

    document.body.classList.contains("dark-mode") ? await putUser(token, { preferences: { theme: "dark" } }) : await putUser(token, { preferences: { theme: "light" } })
    
    verificarLogo()
}

async function putUser(token, dataUser) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    try {
        const res = await fetch(`/api/user/${payload._id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(dataUser)
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