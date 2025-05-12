document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var agendaEl = document.getElementById('agenda');

    fetch(`/api/routines`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE3ZTIzM2Y2MzBhZTU2NjI1Njg4NDgiLCJlbWFpbCI6InRlc3RlQGZvY2EuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDcwMTQwNzksImV4cCI6MTc0NzYxODg3OX0.YtJr6FkOziOtuIlLIejSi2cqbUiVLxUIbH0goP5MOpE`
        }
    })
    .then(res => res.json())
    .then(data => {
        const eventosRotinas = data
         .map(ev => ({
            daysOfWeek: ev.frequency,
            title: ev.title,
            startTime: new Date(ev.timeStart).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit', second: '2-digit'}),
            endTime: new Date(ev.timeEnd).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit', second: '2-digit'}),
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
        contentHeight: 600,
        // expandsRows: true,
        handleWindowResize: true,
        allDaySlot: false,
        slotMinTime: '08:00:00',
        slotMaxTime: '22:00:00',
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
        // events: [
        //     {
        //         groupId: 'rotinas',
        //         daysOfWeek: ['1', '2', '4', '5'],
        //         title: 'Ir para a faculdade',
        //         startTime: '07:10:00',
        //         endTime: '10:20:00',
        //         className: 'evento',
        //         extendedProps: {
        //             description: "hoje to maluco",
        //             completedToday: false,
        //             completedDays: ['2025-05-05', '2025-05-09']
        //         }
        //     },
        //     {
        //         groupId: 'rotinas',
        //         daysOfWeek: ['1', '2', '3', '4', '5'],
        //         title: 'Ir para academia',
        //         startTime: '10:30:00',
        //         endTime: '11:40:00',
        //         className: 'evento',
        //         extendedProps: {
        //             description: "hoje to maluco",
        //             completedToday: false,
        //             completedDays: ['2025-05-05', '2025-05-09']
        //         }
        //     },
        //     {
        //         groupId: 'rotinas',
        //         daysOfWeek: ['1', '2', '3', '4', '5'],
        //         title: 'Ir para o trabalho',
        //         startTime: '11:40:00',
        //         endTime: '17:00:00',
        //         className: 'evento',
        //         extendedProps: {
        //             description: "hoje to maluco",
        //             completedToday: true,
        //             completedDays: ['2025-05-01', '2025-05-09']
        //         }
        //     }
        // ],
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