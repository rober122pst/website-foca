const params = new URLSearchParams(window.location.search);

let timer;
let tempo = params.get("tempo-session")
const task = params.get("task-session");
let interval = params.get("interval-session")
let secondsLeft = params.get("tempo-session");
let timerRunning = false;
let unsavedChanges = false;
let isBreak = false;

let totalTime = 0;

let startTime = null;
let endTime = null;

secondsLeft = parseFloat(tempo)*60;
const token = localStorage.getItem("token") || sessionStorage.getItem("token");
function requestNotificationPermission() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

async function startPauseTimer() {
    if (timerRunning) {
        await pauseTimer();
    }else {
        await startTimer();
    }
}

async function pauseTimer() {
    clearInterval(timer);
    timerRunning = false;
    document.getElementById("startBtn").textContent = "Iniciar";
    document.getElementById("save").classList.remove("hidden");
    await updateUserStatus('online');
}

async function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    unsavedChanges = true;
    if(startTime === null) {
        startTime = Date.now();
    }
    document.getElementById("startBtn").textContent = "Pausar";
    document.getElementById("save").classList.add("hidden");
    await updateUserStatus(!isBreak ? 'focus' : 'online');
    requestNotificationPermission();
    timer = setInterval(async () => {
        if (!isBreak) totalTime += 1;
        secondsLeft--;
        updateDisplay();
        if (secondsLeft <= 0) {
            clearInterval(timer);
            timerRunning = false;
            unsavedChanges = false;
            notifyUser();
            await toggleTimerType();
        }
    }, 1000);
}

async function toggleTimerType() {
    isBreak = !isBreak;
    secondsLeft = isBreak ? parseFloat(interval)*60 : parseFloat(tempo)*60;
    updateDisplay();
    document.getElementById("startBtn").textContent = "Iniciar";
    document.getElementById("save").classList.remove("hidden");
    await updateUserStatus('online');
}

function updateDisplay() {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    document.getElementById("timer").textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function notifyUser() {
    if (Notification.permission === "granted") {
        if(isBreak) {
            new Notification("Hora de voltar!", {
                body: "A pausa acabou! Hora de voltar ao trabalho!",
                icon: "../imgs/foca.svg",
                badge: "../imgs/foca.svg"
            });
        } else {
            new Notification("Pomodoro finalizado! Hora da pausa!", {
                body: `Parbéns! Você focou por ${tempo} min. Agora é hora de fazer uma pausa.`,
                icon: "../imgs/foca.svg",
                badge: "../imgs/foca.svg"
            });
        }
    } else {
        alert("Pomodoro terminado! Faça uma pausa!");
    }
}

async function saveSession() {
    location.reload();
    saveSessionData(!unsavedChanges);
}

async function updateUserStatus(status) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    try {
        const response = await fetch(`/api/user/${payload._id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error("Erro ao atulizar Usuario");
        }
    } catch (error) {
        console.error("Erro: ", error);
    }
}

async function saveSessionData(suscessful, sessionData = null) {
    if(!sessionData) {
        sessionData = {
            startTime: startTime,
            endTime: Date.now(),
            duration: totalTime,
            successful: suscessful,
            taskId: task
        };
    }
    sessionData.duration = Math.round(sessionData.duration/60)
    try {
        const response = await fetch("/api/sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(sessionData)
        });

        if (!response.ok) {
            throw new Error("Erro ao salvar a sessão");
        }

        const data = await response.json();
        console.log("Sessão salva com sucesso:", data);
    } catch (error) {
        console.error("Erro ao salvar a sessão:", error);
    }    
}

window.addEventListener("beforeunload", (e) => {
    if (unsavedChanges) {
        e.preventDefault();
    }
});

window.onload = updateDisplay;