/* global Flickity */

class Carousel { 
  constructor(element, options = {}) {  
    const thisCarousel = this;
    thisCarousel.render(element);
    thisCarousel.initPlugin(options);
  }

  render(element) {
    const thisCarousel = this;
    thisCarousel.element = element; // zapisz referencję do elementu
  }

  initPlugin(options) {
    const thisCarousel = this;
    if (thisCarousel.element) {
      const flickityOptions = {
        cellAlign: 'left',
        contain: true,
        ...(typeof options === 'object' && options !== null ? options : {})
      };
      thisCarousel.flkty = new Flickity(thisCarousel.element, flickityOptions);
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const carouselElem = document.querySelector('.main-carousel');
  new Carousel(carouselElem);
});

export default Carousel;