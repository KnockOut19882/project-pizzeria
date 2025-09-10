import {settings, select} from '../settings.js';
import BaseWidgets from './BaseWidgets.js';

class AmountWidget extends BaseWidgets {
    constructor(element) {
      super (element, settings.amountWidget.defaultValue);
      const thisWidget = this;

      thisWidget.getElements(element);

      thisWidget.initActions();
      thisWidget.renderValue(); 
    }

    getElements() {
      const thisWidget = this;

      thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
      thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    }

    isValid(value) {
      return !isNaN(value)
      && value >= settings.amountWidget.defaultMin
      && value <= settings.amountWidget.defaultMax;
    }

    renderValue() {
      const thisWidget = this;
      if(thisWidget.dom.input) {
        thisWidget.dom.input.value = thisWidget.value;
      }
    }

    initActions() {
      const thisWidget = this;

      if(thisWidget.dom.input) {
        thisWidget.dom.input.addEventListener('change', function() {
          thisWidget.setValue(thisWidget.dom.input.value);
        });
      }

      if(thisWidget.dom.linkDecrease) {
        thisWidget.dom.linkDecrease.addEventListener('click', function(event) {
          event.preventDefault();
          thisWidget.setValue(thisWidget.value - 1);
        });
      }

      if(thisWidget.dom.linkIncrease) {
        thisWidget.dom.linkIncrease.addEventListener('click', function(event) {
          event.preventDefault();
          thisWidget.setValue(thisWidget.value + 1);
        });
      }
    }

    announce() {  
      const thisWidget = this;
      
      const event = new Event('updated', {
        bubbles: true
      });
      thisWidget.dom.wrapper.dispatchEvent(event);
    }
  }

  export default AmountWidget;