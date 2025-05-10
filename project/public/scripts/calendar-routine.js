document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var agendaEl = document.getElementById('agenda');
  
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
        events: [
            {
                groupId: 'rotinas',
                daysOfWeek: ['1', '2', '4', '5'],
                title: 'Ir para a faculdade',
                startTime: '07:10:00',
                endTime: '10:20:00',
                className: 'evento',
                extendedProps: {
                    description: "hoje to maluco",
                    completedToday: false,
                }
            },
            {
                groupId: 'rotinas',
                daysOfWeek: ['1', '2', '3', '4', '5'],
                title: 'Ir para academia',
                startTime: '10:30:00',
                endTime: '11:40:00',
                className: 'evento',
                extendedProps: {
                    description: "hoje to maluco",
                    completedToday: false,
                }
            },
            {
                groupId: 'rotinas',
                daysOfWeek: ['1', '2', '3', '4', '5'],
                title: 'Ir para o trabalho',
                startTime: '11:40:00',
                endTime: '17:00:00',
                className: 'evento',
                extendedProps: {
                    description: "hoje to maluco",
                    completedToday: false,
                }
            }
        ],
        eventContent: function(arg) {
            const props = arg.event.extendedProps;
            console.log('props', props)
            return {
                html: `
                <div>
                    <b>${arg.event.title}</b><br>
                    <em>${props.description}</em>
                    <small>${arg.timeText}</small>
                </div>
                <div class="button-swipe">
                    <span></span>
                </div>
                `
            };
        },
        eventDidMount: function(info) {
            const btn = info.el.querySelector('.button-swipe');
            if (btn) {
                btn.addEventListener('click', (e) => {
                e.stopPropagation();

                const evento = info.event;

                // Pega a data atual (só a parte da data, sem hora)
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                
                // Data do evento (também zerando hora pra comparar só a data)
                const dataEvento = new Date(evento.start);
                dataEvento.setHours(0, 0, 0, 0);
                
                // Verifica se é o mesmo dia
                const mesmoDia = hoje.getTime() === dataEvento.getTime();
                
                if (mesmoDia) {
                    // Faz alguma ação com o evento, tipo marcar como concluído
                    btn.classList.toggle('active');
                    btn.classList.remove('none');
                } else {
                    btn.classList.add('none');
                }
                });
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