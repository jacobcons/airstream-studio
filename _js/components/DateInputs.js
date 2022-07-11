import flatpickr from 'flatpickr'

export default class DateInputs {
  constructor() {
    flatpickr('.input-field__date', {
      dateFormat: 'J F, Y'
    })
    
    const timePickers = flatpickr('.input-field__time', {
      enableTime: true,
      noCalendar: true,
      allowInput:true,
      dateFormat: 'h:i K'
    })
    
    timePickers[0].config.onClose = [() => {
      setTimeout(() => timePickers[1].open(), 1);
    }];

    timePickers[0].config.onChange = [(selDates) => {
      timePickers[1].set("minDate", selDates[0]);
    }];

    timePickers[1].config.onChange = [(selDates) => {
      timePickers[0].set("maxDate", selDates[0]);
    }]
  }
}
