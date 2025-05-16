let resizeTimeout;
const token = localStorage.getItem("token") || sessionStorage.getItem("token")

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
