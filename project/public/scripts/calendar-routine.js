// const token = localStorage.getItem("token") || sessionStorage.getItem("token");
document.addEventListener('DOMContentLoaded', function() {

    var calendarEl = document.getElementById('calendar');

    fetch(`/api/routines`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        const eventosRotinas = data
         .map(ev => ({
            daysOfWeek: ev.frequency,
            title: ev.title,
            startTime: ev.timeStart,
            endTime: ev.timeEnd,
            extendedProps: {
                description: ev.description,
                completedToday: ev.completedToday,
                completedDays: ev.com
            }
         }));
        calendar.addEventSource({ groupId: 'rotinas', events: eventosRotinas });
    });
  
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'pt-br',
        timezone: 'America/Recife',
        initialView: 'timeGridWeek',
        initialDate: Date.now(),
        aspectRatio: 1.35,
        // contentHeight: 600,
        // expandsRows: true,
        handleWindowResize: true,
        allDaySlot: false,
        headerToolbar: {left: 'title', end: 'timeGridDay,timeGridWeek,dayGridMonth prev,next today'},
        multiMonthMaxColumns: 1,
        titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
        dayHeaderFormat: {
            weekday: 'short'
        },
        buttonText: {
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            list: 'Lista'
        },
        windowResize: function(arg) {
            const screenWidth = window.innerWidth;
            ;
            if(screenWidth <= 768) {
                calendar.setOption('aspectRatio', .65);
            }else {
                calendar.setOption('aspectRatio', 1.35);
            }
        },
        eventContent: function(arg) {
            const props = arg.event.extendedProps;
            const completados = props.completedDays || [];
            const dataEvento = arg.event.start;
            const dataFormatada = dataEvento.toISOString().split('T')[0];
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            let icon = '<i class="fa-solid fa-hourglass-start"></i>'

            if(completados.includes(dataFormatada)) {
                icon = '<i class="fa-solid fa-check"></i>'
            } else if (dataEvento < hoje) {
                icon = '<i class="fa-solid fa-x"></i>'
            }
            return {
                html: `
                <div>
                    ${icon}<br><b>${arg.event.title}</b><br>
                </div>
                
                `
            };
        },
        eventDidMount: function(info) {
            const completados = info.event.extendedProps.completedDays || [];
            const dataEvento = info.event.start;
            const dataFormatada = dataEvento.toISOString().split('T')[0];
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            if (completados.includes(dataFormatada)) {
                info.el.style.backgroundColor = ' #4ade80 ';
                info.el.classList.add("done");
            }else if (dataEvento < hoje) {
                info.el.style.backgroundColor = ' #ffcdcb ';
                info.el.classList.add("not-done");
            }
        },
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
        }
        });
    calendar.setOption('locale', 'pt-br')
    calendar.render();
});