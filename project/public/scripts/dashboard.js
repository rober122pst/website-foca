const taskList = document.getElementById('taskList');
const routineList = document.getElementById('routineList');
// const taskForm = document.getElementById('taskForm');
// const taskInput = document.getElementById('taskInput');
// const completedCountEl = document.getElementById('completedCount');
// const uncompletedCountEl = document.getElementById('uncompletedCount');
// const ctx = document.getElementById('tasksChart').getContext('2d');

const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');

const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const tarefasEl = document.getElementById('tarefas')
let taskToDeleteId = null;

async function carregarDados() {
    try {
        const [tasks, routines, routinesToday, sessionTime, dailyChallenge, ranking, rankingFriends] = await Promise.all([
            getApiData('tasks'),
            getApiData('routines'),
            getApiData('routines/today'),
            getApiData('sessions/total-duration'),
            getApiData('daily-challenge'),
            getApiData('ranking'),
            getApiData('ranking/friends')
        ])

        const user = await getUser(token);
        await renderTaskList(tasks);
        await renderRoutineList(routinesToday);
        await updateCountsAndOptions(tasks);

        const sequenciaEl = document.getElementById('sequencia')
        sequenciaEl.textContent = user.gamification.streak + " dias";

        
        const minutosEl = document.getElementById('minutos')
        if(sessionTime.totalDuration < 60) {
            minutosEl.textContent = sessionTime.totalDuration + " minutos";
        } else {
            const horas = Math.floor(sessionTime.totalDuration / 60);
            const minutos = sessionTime.totalDuration % 60;
            minutosEl.textContent = `${horas}h${
                minutos < 10 ? '0' + minutos : minutos
            }`;
        }

        const completed = tasks.filter(t => t.completed);
        
        tarefasEl.textContent = completed.length + " tarefas";

        const rotinasEl = document.getElementById('rotinas')
        rotinasEl.textContent = routines.length + " rotinas";

        await renderDailyChallenge(dailyChallenge);

        await renderRankingTables(ranking, rankingFriends);
    } catch (erro) {
        console.error('Falha ao carregar dados:', erro);
        document.getElementById('main-content').innerHTML = `
            <h1 class="text-red-500 text-2xl font-bold">Erro ao carregar dados.</h1>
            <p>${erro.message}</p>
        `;
    } finally {
        // Esconde o loading e mostra o conteúdo
        loadingScreen.classList.add('opacity-0');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', carregarDados);

async function renderDailyChallenge(dailyChallenge) {
    const desafioEl = document.getElementById('desafio');
    if(dailyChallenge) {
        desafioEl.innerHTML = `
            <h1 class="text-5xl text-[--color-items-primary] font-black">${dailyChallenge.title}</h1>
            <p class="text-[#b6afaf] text-sm mt-2">${dailyChallenge.description}</p>
            <br>
            <div class="flex gap-10 items-center">
                <div class="flex items-center gap-2 align-middle text-xl font-bold text-[--color-items-primary]">
                    <span class="material-symbols-rounded text-[--accent] text-3xl">paid</span> ${formatarPara00_00(dailyChallenge.rewardCoins)} $
                </div>
                <div class="flex items-center gap-2 align-middle text-xl font-bold text-[--color-items-primary]">
                    <span class="material-symbols-rounded text-[--accent] text-3xl">star</span> ${dailyChallenge.rewardXP} XP
                </div>
            </div>
            <br>
            <div class="bg-[--bg-second] rounded-lg w-full max-w-[13rem] h-3 overflow-hidden">
                <div class="bg-[--color-items-primary] w-2/3 h-full"></div>
            </div>
            <br>
            <div>
                <button class="bg-[--color-items-primary] text-[var(--text-light)] font-bold text-sm py-2 px-4 rounded-lg hover:bg-[--color-items-second] transition duration-300">Detalhes</button>
            </div>
            <br>
            <p id="challenge-description" class="text-[#b6afaf] text-sm mt-2">Amigos que já concluiram: </p>
            <br>
        `
    }else {
        desafioEl.innerHTML = `
            <h1 class="text-5xl text-[--color-items-primary] font-black">Desafio do dia</h1>
            <p class="text-[#b6afaf] text-sm mt-2">Sem desafios por hoje!</p>
        `
    }
}

async function renderRankingTables(ranking, rankingFriends) {
    const rankingFriendsTable = document.getElementById('rankingFriendsTable');
    const cincoPrimeirosAmigos = rankingFriends.slice(0, 5);
    cincoPrimeirosAmigos.forEach((user) => {
        const tr = document.createElement('tr');
        tr.className = "text-left border-t border-[--bg-second] align-middle";
        tr.innerHTML = `
            <td class="text-sm font-extrabold py-3 text-[--accent]">${user.pos}</td>
            <td class="text-sm font-extrabold py-3">
                <div class="flex items-center gap-2">
                    <img src="${user.avatar || 'upload/default-profile.png'}" alt="" class="w-8 h-8 rounded-full">
                    <span class="text-[--color-items-primary]">${user.username}</span>
                </div>
            </td>
            <td class="text-sm font-extrabold py-3">${user.level}</td>
            <td class="text-sm font-extrabold py-3">${user.focus}</td>
            <td class="text-sm font-extrabold py-3">${user.tasks}</td>
        `
        rankingFriendsTable.appendChild(tr);
    });

    const rankingTable = document.getElementById('rankingTable');
    const cincoPrimeiros = ranking.slice(0, 5);

    cincoPrimeiros.forEach((user) => {
        const tr = document.createElement('tr');
        tr.className = "text-left border-t border-[--bg-second] align-middle";
        tr.innerHTML = `
            <td class="text-sm font-extrabold py-3 text-[--accent]">${user.pos}</td>
            <td class="text-sm font-extrabold py-3">
                <div class="flex items-center gap-2">
                    <img src="${user.avatar || 'upload/default-profile.png'}" alt="" class="w-8 h-8 rounded-full">
                    <span class="text-[--color-items-primary]">${user.username}</span>
                </div>
            </td>
            <td class="text-sm font-extrabold py-3">${user.level}</td>
            <td class="text-sm font-extrabold py-3">${user.focus}</td>
            <td class="text-sm font-extrabold py-3">${user.tasks}</td>
        `
        rankingTable.appendChild(tr);
    });
}


// Render task list items
async function renderTaskList(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task =>  {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center rounded-md py-3 px-1';

        const label = document.createElement('label');
        label.className = 'flex items-center gap-2 cursor-pointer select-none';
        label.setAttribute('for', `task-${task._id}`);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task._id}`;
        checkbox.checked = task.completed;
        checkbox.className = 'custom-checkbox';
        checkbox.addEventListener('change', async () => {
            task.completed = checkbox.checked;
            await putApiData(`tasks/${task._id}`, { completed: task.completed, completedAt: task.completed ? new Date() : null })
            await renderTaskList(tasks);
            await updateCountsAndOptions(tasks);
        });

        const span = document.createElement('span');
        span.textContent = task.title;
        if (task.completed) {
            span.className = 'line-through title-[#666666]';
        }

        label.appendChild(checkbox);
        label.appendChild(span);

        const btnRemove = document.createElement('button');
        btnRemove.setAttribute('aria-label', `Remover tarefa ${task.text}`);
        btnRemove.className = 'text-[var(--color-items-primary)] hover:text-[#c4002f] ml-4';
        btnRemove.innerHTML = '<i class="fas fa-trash-alt"></i>';
        btnRemove.addEventListener('click', async () => {
            taskToDeleteId = task._id;
            confirmMessage.textContent = `Deseja realmente remover a tarefa:\n"${task.title}"?`;
            confirmModal.classList.remove('hidden');
            confirmYes.onclick = () => confirmYesClick(tasks);
        });

        li.appendChild(label);
        li.appendChild(btnRemove);
        taskList.appendChild(li);
    });
}

async function renderRoutineList(routines) {
    routineList.innerHTML = '';
    routines.forEach(routine =>  {
        const data = new Date();
        const formato = new Intl.DateTimeFormat('fr-CA',{
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(data);
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center rounded-md py-3 px-1';

        const label = document.createElement('label');
        label.className = 'flex items-center gap-2 cursor-pointer select-none';
        label.setAttribute('for', `routine-${routine._id}`);
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `routine-${routine._id}`;
        checkbox.checked = routine.completedToday;
        checkbox.className = 'custom-checkbox';
        checkbox.addEventListener('change', async () => {
            routine.completedToday = checkbox.checked;
            if(routine.completedToday) {
                await putApiData(`routines/${routine._id}`, { completedToday: routine.completedToday, completedDays: [...routine.completedDays, formato] });
            }else {
                await putApiData(`routines/${routine._id}`, { completedToday: routine.completedToday, completedDays: routine.completedDays.filter(d => d !== formato) });
            }
            await renderRoutineList(routines);
            // await updateCountsAndOptions(routines);
        });
        
        const span = document.createElement('span');
        span.textContent = routine.title;
        if (routine.completedToday) {
            span.className = 'line-through title-[#666666]';
        }

        label.appendChild(checkbox);
        label.appendChild(span);

        li.appendChild(label);
        routineList.appendChild(li);
    });
}
// Update completed/uncompleted counts and chart
async function updateCountsAndOptions(tasks) {
    const completed = tasks.filter(t => t.completed);
    tarefasEl.textContent = completed.length + " tarefas";
    
    await selectTaks(tasks);
}

// Confirmation modal buttons
async function confirmYesClick(tasks) {
    if (taskToDeleteId !== null) {
        await deleteApiData(`tasks/${taskToDeleteId}`)
        tasks = tasks.filter(t => t._id !== taskToDeleteId);
        taskToDeleteId = null;
        confirmModal.classList.add('hidden');
        await renderTaskList(tasks);
        await updateCountsAndOptions(tasks);
    }
};

confirmNo.addEventListener('click', () => {
    taskToDeleteId = null;
    confirmModal.classList.add('hidden');
});


async function selectTaks(tasks) {
    const selectTasksEl = document.getElementById('task-session');
    selectTasksEl.innerHTML = '';
    tasks
     .filter(t => t.completed === false)
     .forEach(t => {
        const option = document.createElement("option");
        option.value = t._id;
        option.text = t.title;
        selectTasksEl.appendChild(option);
     })
}