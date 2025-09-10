  import {templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';

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
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector('input.amount[name="people"]');
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector('input.amount[name="hours"]');
  }
  initWidgets() {
    const thisBooking = this;
    if(thisBooking.dom.peopleAmount) {
      thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    }
    if(thisBooking.dom.hoursAmount) {
      thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    }
  }
}

export default Booking;