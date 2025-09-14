import {settings, select, classNames, templates} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';
import Carousel from './components/Carousel.js';

const app = {

  initBooking: function(){
    const thisApp = this;
    const bookingContainer = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(bookingContainer);
  },
  initPages: function() {
    const thisApp = this;
    thisApp.pages = document.querySelectorAll('#pages > section');
    thisApp.navLinks = document.querySelectorAll('.main-nav a');

    const activatePage = function(pageId) {
      for(let page of thisApp.pages){
        page.classList.toggle(classNames.pages.active, page.id === pageId);
      }
      for(let link of thisApp.navLinks){
        link.classList.toggle(classNames.nav.active, link.getAttribute('href') === '#' + pageId);
      }
    };

    window.addEventListener('hashchange', function(){
      const idFromHash = window.location.hash.replace('#', '');
      activatePage(idFromHash || 'home');
    });

    const idFromHash = window.location.hash.replace('#', '');
    activatePage(idFromHash || 'home');
  },
  activatePage: function(pageId){
    const thisApp = this;
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id === pageId);
    }
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') === '#' + pageId
      );
    }
  },

  initMenu: function() {
      const thisApp = this;
      for(let productData of thisApp.data.products) {
        new Product(productData.id, productData);
      }
  },
    initData: function() {
      const thisApp = this;
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;
      fetch(url)
        .then(function(rawResponse) {
          return rawResponse.json();
        })
        .then(function(parsedResponse) {
          console.log('parsedResponse', parsedResponse);
          thisApp.data.products = parsedResponse;
          thisApp.initMenu();
        });
    },
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      
      thisApp.initData();
      thisApp.initCart();
      thisApp.initPages();
      thisApp.initBooking();
    },
    initCart: function(){
      const thisApp = this;
      const cartElement = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElement);
      thisApp.productList = document.querySelector(select.containerOf.menu);
      thisApp.productList.addEventListener('add-to-cart', function(event){
        app.cart.add(event.detail.product);
      });
    }
  };

  app.init();

const homeElem = document.querySelector('#home');
new Home(homeElem);

const carouselElem = document.querySelector('.main-carousel');
new Carousel(carouselElem);
