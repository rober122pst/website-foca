
// const token = localStorage.getItem("token") || sessionStorage.getItem("token");
document.addEventListener('DOMContentLoaded', async function() {

    if(!token) {
        window.location.href('/')
    }

    const res = await fetch(`/api/routines`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
    })

    const rotinas = await res.json()

    await gerarCards(rotinas);


    
});

document.querySelector('.routines-container').addEventListener('click', (e) => {
    console.log("cliquei")
    if (e.target.classList.contains("edit-routine")) {
        const id = e.target.dataset.id;
        abrirFormRotina(id);
    }
});

const formEditar = document.querySelector("#popup form")

async function abrirFormRotina(id) {
    const res = await fetch(`/api/routines/${id}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
    })
    const rotina = await res.json();

    document.getElementById("popup").style.display = "flex";
    document.getElementById("popup").setAttribute('data-id', rotina._id);;

    formEditar.querySelector("#titulo").value = rotina.title;
    formEditar.querySelector("#descricao").value = rotina.description || '';
    formEditar.querySelector("#time-start").value = rotina.timeStart;
    formEditar.querySelector("#time-end").value = rotina.timeEnd;

    const botoes = formEditar.querySelectorAll(".semanas-button button");
    botoes.forEach(btn => btn.classList.remove("escolhido"));

    // Marca os dias da rotina
    rotina.frequency.forEach((diaIndex) => {
        botoes[diaIndex].classList.add("escolhido"); // 0 = Domingo, 6 = Sábado
    });

    // Armazena o ID da rotina pra deletar depois
    document.getElementById("popup").dataset.id = rotina._id;
}

function criarRoutine() {
    document.getElementById("popup-criar").style.display = "flex";
}

function fecharRotina() {
    document.querySelector("#popup").style.display = "none";
    document.querySelector("#popup-criar").style.display = "none";
    document.querySelector('.popup form').reset();
    document.getElementById("popup").removeAttribute('data-id');
}

function toggleDia(button) {
    button.classList.toggle("escolhido");
}


async function editRoutine(id) {
    const title = formEditar.querySelector("#titulo").value;
    const description = formEditar.querySelector("#descricao").value;
    const buttons = formEditar.querySelectorAll(".semanas-button button");
    const timeStart = formEditar.querySelector("#time-start").value;
    const timeEnd = formEditar.querySelector("#time-end").value;

    let frequency = [];

    const updatedAt = Date.now()

    buttons.forEach((botao, index) => {
        if (botao.classList.contains('escolhido')) {
            frequency.push(index.toString());
        }
    });

    if (frequency.length === 0) {
        buttons.forEach(botao => botao.classList.add('escolhido'));
        frequency = Array.from({ length: 7 }, (_, i) => i.toString());
    }

    const res = await fetch(`/api/routines/${id}`, { // faz a requisição para o backend
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ title, description, frequency, timeStart, timeEnd, updatedAt }),
    });
    const rotina = await res.json()
    if(res.ok) {
        location.reload();
        fecharRotina();
    }
}


const formCriar = document.querySelector("#popup-criar form")
async function postarRotina() {
    const title = formCriar.querySelector("#titulo").value;
    const description = formCriar.querySelector("#descricao").value;
    const buttons = formCriar.querySelectorAll(".semanas-button button");
    const timeStart = formCriar.querySelector("#time-start").value;
    const timeEnd = formCriar.querySelector("#time-end").value;

    let frequency = [];

    buttons.forEach((botao, index) => {
        if (botao.classList.contains('escolhido')) {
            frequency.push(index.toString());
        }
    });

    if (frequency.length === 0) {
        buttons.forEach(botao => botao.classList.add('escolhido'));
        frequency = Array.from({ length: 7 }, (_, i) => i.toString());
    }

    const res = await fetch(`/api/routines`, { // faz a requisição para o backend
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ title, description, frequency, timeStart, timeEnd }),
    });
    const rotina = await res.json();
    location.reload();
    fecharRotina()
}

formCriar.addEventListener("submit", (event) => {
    event.preventDefault()
    postarRotina()
})

formEditar.addEventListener("submit", (event) => {
    event.preventDefault();
    const idRotina = document.getElementById("popup").dataset.id;
    editRoutine(idRotina);
})

async function gerarCards(rotinas) {
    rotinas.forEach(r => {
        gerarNovoCard(r)
    });
}

async function gerarNovoCard(r) {
    const container = document.querySelector(".routines-container");
    const card = document.createElement("div");
    const semanas_days = ["D","S","T","Q","Q","S","S"]
    card.setAttribute('data-id', r._id);
    card.className = "routine";
    card.innerHTML = `
    <b>${r.title}</b>
    <em>${r.description || ""}</em>
    <div class="semanas">
        ${semanas_days.map((dia, i) => {
            const ativo = r.frequency.includes(i.toString());
            return `<span class="${ativo ? 'dia-ativo' : ''}">${dia}</span>`;
        }).join('')}
    </div>
    <div class="bottom">
        <small>${r.timeStart}-${r.timeEnd}</small>
        <i class="edit-routine fa-solid fa-pen" data-id="${r._id}"></i>
    </div>
    `;

    container.prepend(card);
}

async function editarCard(rotinaAtualizada) {
    const card = document.querySelector(`[data-id="${rotinaAtualizada._id}"]`);
    if(card) {
        const semanas_days = ["D","S","T","Q","Q","S","S"];
        card.innerHTML = `
        <b>${rotinaAtualizada.title}</b>
        <em>${rotinaAtualizada.description || ""}</em>
        <div class="semanas">
            ${semanas_days.map((dia, i) => {
                const ativo = rotinaAtualizada.frequency.includes(i.toString());
                return `<span class="${ativo ? 'dia-ativo' : ''}">${dia}</span>`;
            }).join('')}
        </div>
        <div class="bottom">
            <small>${rotinaAtualizada.timeStart}-${rotinaAtualizada.timeEnd}</small>
            <i class="edit-routine fa-solid fa-pen" data-id="${rotinaAtualizada._id}"></i>
        </div>
        `;
    }
    
}

function excluirRotina() {
    const idRotina = document.getElementById("popup").dataset.id;

    if (!idRotina) return alert("Rotina não encontrada!");

    if (confirm("Tem certeza que deseja excluir esta rotina?")) {
        // Aqui você pode chamar uma função do backend, ou apenas remover da lista local
        // Exemplo com fetch:
        fetch(`/api/routines/${idRotina}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`
            },
        }).then(res => {
            if (res.ok) {
                alert("Rotina excluída com sucesso!");
                fecharRotina();
                location.reload(); // ou atualizar sua UI
            } else {
                alert("Erro ao excluir rotina.");
            }
        });
    }
}