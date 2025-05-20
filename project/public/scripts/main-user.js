let resizeTimeout;
const token = localStorage.getItem("token") || sessionStorage.getItem("token")

function isSameDayInBrasilia(date1, date2) {
    const offset = -3 * 60; // UTC-3 em minutos

    function toBrasiliaDateOnly(date) {
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        const brTime = new Date(utc + offset * 60000);
        return `${brTime.getFullYear()}-${brTime.getMonth()}-${brTime.getDate()}`;
    }

    return toBrasiliaDateOnly(date1) !== toBrasiliaDateOnly(date2);
}


document.addEventListener('DOMContentLoaded', async function() {
    if (!token) return;
    
    user = await getUser(token);
    const hoje = new Date()
    if(isSameDayInBrasilia(new Date(user.productivityStats.lastSessionDate), hoje)) {
        console.log("É hoje!")
        user.productivityStats.lastSessionDate = hoje;
        user.productivityStats.dailyStreak += 1;
        await putUser(token, {
            productivityStats: {
                lastSessionDate: user.productivityStats.lastSessionDate,
                dailyStreak: user.productivityStats.dailyStreak
            }
        })
    }else {
        console.log("Não é hoje!")
    }

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
        if(!res.ok) { console.error(data.message || data.error); return }
        return data
    } catch (e) {
        console.error(e);
        return
    }
}

async function deleteApiData(endpoint) {
    try {
        const res = await fetch(`/api/${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await res.json();
        if(!res.ok) { console.error(data.message || data.error); return }
        return data
    } catch (e) {
        console.error(e);
        return
    }
}

async function putApiData(endpoint, body) {
    try {
        const res = await fetch(`/api/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
        const data = await res.json();
        if(!res.ok) { console.error(data.message || data.error); return }
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