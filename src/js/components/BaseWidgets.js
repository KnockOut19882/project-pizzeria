import {settings} from '../settings.js';

class BaseWidgets {
  constructor(wrapperElement, initialValue) {
    const thisWidget = this;
    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;
    thisWidget.value = initialValue;
  }

  setValue(value) {
      const thisWidget = this;
      const newValue = thisWidget.parseValue(value);

      if(thisWidget.isValid(newValue) && 
         newValue >= settings.amountWidget.defaultMin &&
         newValue <= settings.amountWidget.defaultMax &&
         newValue !== thisWidget.value) {
        
        thisWidget.value = newValue;
        thisWidget.announce();
      }
      
      thisWidget.renderValue();
    }

  parseValue(value) {
    return parseInt(value);
  }

  isValid(value) {
    return !isNaN(value);
  }

  renderValue() {
    const thisWidget = this;
    if (thisWidget.dom.input) {
      thisWidget.dom.input.value = thisWidget.value;
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

export default BaseWidgets;