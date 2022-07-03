import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const options = {

  service: null,

  method: null,

  urlPath: '',

  params: null,

  eventProps: {
    title: "",
    start: "",
    end: "",
  },

  calendarOptions: {  
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  
    defaultView: 'dayGridMonth',
  
    defaultDate: new Date(),
  
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
  
    editable: true,

    displayEventTime: true,

    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: true,
      hour12: true
    },
  
    dateClick: () => {},
  
    eventClick: () => {},
  }  
}

export {
  options
}