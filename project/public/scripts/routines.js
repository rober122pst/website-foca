function editRoutine() {
    document.getElementById("popup").style.display = "flex";
}

function fecharEditarRotina() {
    document.getElementById("popup").style.display = "none";
}

function toggleDia(button) {
    button.classList.toggle("escolhido");
}

document.addEventListener('DOMContentLoaded', function() {
    const semanas_days = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"]
    fetch(`/api/routines`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE3ZTIzM2Y2MzBhZTU2NjI1Njg4NDgiLCJlbWFpbCI6InRlc3RlQGZvY2EuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDcwMTQwNzksImV4cCI6MTc0NzYxODg3OX0.YtJr6FkOziOtuIlLIejSi2cqbUiVLxUIbH0goP5MOpE`
        }
    })
    .then(res => res.json())
    .then(rotinas => {
        const container = document.querySelector(".routines-container");

        rotinas.forEach(r => {
            const card = document.createElement("div");
            card.className = "routine";
            const horaStart = new Date(r.timeStart).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const horaEnd = new Date(r.timeEnd).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            card.innerHTML = `
            <b>${r.title}</b>
            <em>${r.description || ""}</em>
            <div class="semanas">
                ${r.frequency.map(dia => `<span>${semanas_days[dia]}</span>`).join(' ')}
            </div>
            <div class="bottom">
                <small>${horaStart}-${horaEnd}</small>
                <i onclick="editRoutine()" class="edit-routine fa-solid fa-pen"></i>
            </div>
            `;

            container.appendChild(card);
        });
    });
});