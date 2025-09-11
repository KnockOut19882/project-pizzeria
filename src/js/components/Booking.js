import {select, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(bookingContainer){
    const thisBooking = this;
    thisBooking.render(bookingContainer);
    thisBooking.initWidgets();
  }

  render(bookingContainer) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = bookingContainer;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
  }
  initWidgets() {
    const thisBooking = this;
    if(thisBooking.dom.peopleAmount) {
      thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    }
    if(thisBooking.dom.hoursAmount) {
      thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    }
    if(thisBooking.dom.datePicker) {
      thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    }
    if(thisBooking.dom.hourPicker) {
      thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    }
  }
}

export default Booking;