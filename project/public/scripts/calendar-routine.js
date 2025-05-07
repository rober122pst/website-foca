document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
  
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'pt-br',
        timezone: 'America/Recife',
        initialView: 'timeGridDay',
        initialDate: Date.now(),
        height: 400,
        contentHeight: 'auto',
        // aspectRatio: 2,
        // expandsRows: true,
        handleWindowResize: true,
        allDaySlot: false,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek'
        },
        titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
        dayHeaderFormat: {
            weekday: 'long'
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
                extendsProps: {
                    description: "hoje to maluco",
                    completed: false,
                    createdAt: '2025-05-06T16:40:00',
                    dueDate: '2025-05-06T16:40:00',
                    priority: 'medium',
                    category: 'geral',
                    isRecurring: true
                }
            },
            {
                groupId: 'rotinas',
                daysOfWeek: ['1', '2', '3', '4', '5'],
                title: 'Ir para academia',
                startTime: '10:30:00',
                endTime: '11:40:00',
                className: 'evento',
                extendsProps: {
                    description: "hoje to maluco",
                    completed: false,
                    createdAt: '2025-05-06T16:40:00',
                    dueDate: '2025-05-06T16:40:00',
                    priority: 'medium',
                    category: 'geral',
                    isRecurring: true
                }
            },
            {
                groupId: 'rotinas',
                daysOfWeek: ['1', '2', '3', '4', '5'],
                title: 'Ir para o trabalho',
                startTime: '11:40:00',
                endTime: '17:00:00',
                className: 'evento',
                extendsProps: {
                    description: "hoje to maluco",
                    completed: false,
                    createdAt: '2025-05-06T16:40:00',
                    dueDate: '2025-05-06T16:40:00',
                    priority: 'medium',
                    category: 'geral',
                    isRecurring: true
                }
            }
        ],
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
        }
        });
        calendar.setOption('locale', 'pt-br')
        calendar.render();
  });