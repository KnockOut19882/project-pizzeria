/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

const select = {
  templateOf: {
    menuProduct: "#template-menu-product",
    cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
  cart: {
    wrapperActive: 'active',
  },
  // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
  // CODE ADDED END
    db: {
    url: '//localhost:3131',
    products: 'products',
    orders: 'orders',
},
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML), //CODE ADDED
  };

  class AmountWidget {
    constructor(element) {
      const thisWidget = this;
      thisWidget.getElements(element);
      thisWidget.setValue(settings.amountWidget.defaultValue);
      thisWidget.initActions();
    }

    getElements(element) {
      const thisWidget = this;
      thisWidget.element = element;

      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);

      if(!isNaN(newValue) && 
         newValue >= settings.amountWidget.defaultMin &&
         newValue <= settings.amountWidget.defaultMax &&
         newValue !== thisWidget.value) {
        
        thisWidget.value = newValue;
        thisWidget.announce();
      }
      
      thisWidget.input.value = thisWidget.value;
    }

    initActions() {
      const thisWidget = this;
      
      thisWidget.input.addEventListener('change', function() {
        thisWidget.setValue(thisWidget.input.value);
      });
      
      thisWidget.linkDecrease.addEventListener('click', function(event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);  // ← UPROSZCZONA logika
      });
      
      thisWidget.linkIncrease.addEventListener('click', function(event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);  // ← UPROSZCZONA logika
      });
    }

    announce() {  
      const thisWidget = this;
      
      const event = new Event('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }
  }

  class Cart {
    constructor(element) {
      const thisCart = this;
      thisCart.products = [];
      thisCart.getElements(element);
      thisCart.initActions();
  }
    getElements(element) {
      const thisCart = this;
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
      thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelector(select.cart.totalPrice);
      thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.address = thisCart.dom.form.querySelector(select.cart.address);
      thisCart.dom.phone = thisCart.dom.form.querySelector(select.cart.phone);
    }
    initActions() {
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function(event){
        event.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      thisCart.dom.productList.addEventListener('updated', function() {
        thisCart.update();
      });
      thisCart.dom.productList.addEventListener('remove', function(event) {
        thisCart.remove(event.detail.cartProduct);
      });
      thisCart.dom.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisCart.sendOrder();
      });
    }
    sendOrder() {
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.orders;
      const payload = {
        address: thisCart.dom.address.value,
        phone: thisCart.dom.phone.value,
        totalPrice: thisCart.totalPrice,
        subtotalPrice: thisCart.subtotalPrice,
        totalNumber: thisCart.totalNumber,
        deliveryFee: thisCart.dom.deliveryFee.innerHTML,
        products: [],
      };
      for(let prod of thisCart.products) {
        payload.products.push(prod.getData());
      }
      const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        };
      fetch(url, options);
    }
    
    add(menuProduct) {
      const thisCart = this;
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      thisCart.dom.productList.appendChild(generatedDOM);
      const cartProduct = new CartProduct(menuProduct, generatedDOM);
      thisCart.products.push(cartProduct);
      thisCart.update();
    }
    update() {
      const thisCart = this;
      const deliveryFee = settings.cart.defaultDeliveryFee;
      let totalNumber = 0;
      let subtotalPrice = 0;
      thisCart.totalNumber = totalNumber;
      thisCart.subtotalPrice = subtotalPrice;
      for(let cartProduct of thisCart.products) {
        totalNumber += cartProduct.amount;
        subtotalPrice += cartProduct.price;
      }
      thisCart.totalPrice = subtotalPrice + deliveryFee;
      if(totalNumber === 0) {
        thisCart.totalPrice = 0;
      }
      const totalPriceElems = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
      for (let elem of totalPriceElems) {
        elem.innerHTML = thisCart.totalPrice;
      }
      console.log('totalNumber', totalNumber);
      console.log('subtotalPrice', subtotalPrice);
      console.log('totalPrice', thisCart.totalPrice);
      thisCart.dom.totalNumber.innerHTML = totalNumber;
      thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
      thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
      thisCart.dom.deliveryFee.innerHTML = totalNumber === 0 ? 0 : deliveryFee;
    }
    remove(cartProduct) {
      const thisCart = this;
      cartProduct.dom.wrapper.remove();
      const index = thisCart.products.indexOf(cartProduct);
      console.log('Removing cart product:', cartProduct);
      thisCart.products.splice(index, 1);
      thisCart.update();
    }
  }

  class CartProduct {
    constructor(menuProduct, element) {
      const thisCartProduct = this;
      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.params = menuProduct.params;
      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();
    }
    getData() {
      const thisCartProduct = this;
      return {
        id: thisCartProduct.id,
        name: thisCartProduct.name,
        amount: thisCartProduct.amount,
        priceSingle: thisCartProduct.priceSingle,
        price: thisCartProduct.price,
        params: thisCartProduct.params
      };
    }
    getElements(element) {
      const thisCartProduct = this;
      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = element.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = element.querySelector(select.cartProduct.remove);
    }
    initAmountWidget() {
        const thisCartProduct = this;
        thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
        thisCartProduct.amountWidget.setValue(thisCartProduct.amount);
        thisCartProduct.dom.amountWidget.addEventListener('updated', function() {
          thisCartProduct.amount = thisCartProduct.amountWidget.value;
          thisCartProduct.price = thisCartProduct.amount * thisCartProduct.priceSingle;
          thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
          const event = new CustomEvent('updated', { bubbles: true });
          thisCartProduct.dom.wrapper.dispatchEvent(event);
        });
    }
    remove() {
      const thisCartProduct = this;
      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });
      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }
    initActions() {
      const thisCartProduct = this;
      thisCartProduct.dom.edit.addEventListener('click', function(event) {
        event.preventDefault();
        thisCartProduct.edit();
      });
      thisCartProduct.dom.remove.addEventListener('click', function(event) {
        event.preventDefault();
        thisCartProduct.remove();
      });
    }
  }

  const app = {
    initMenu: function() {
      const thisApp = this;
      for(let productData in thisApp.data.products) {
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
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
    },
    initCart: function(){
      const thisApp = this;
      const cartElement = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElement);
    }
  };

class Product {
    constructor(id, data) {
      const thisProduct = this;
      thisProduct.dom = {};
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.initAccordion();
      thisProduct.getElements();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
    }
    renderInMenu() {
      const thisProduct = this;
      const generatedHTML = templates.menuProduct(thisProduct.data);
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
    }
    getElements(){
      const thisProduct = this;
      thisProduct.dom.wrapper = thisProduct.element;
      thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.dom.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.dom.formInputs = thisProduct.dom.form.querySelectorAll(select.all.formInputs);
      thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.dom.amountWidget = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }
    initAmountWidget() {
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.dom.amountWidget);
      thisProduct.dom.amountWidget.addEventListener('updated', function() {
        thisProduct.processOrder();
      });
    }
    addToCart() {
      const thisProduct = this;
      app.cart.add(thisProduct.prepareCartProduct());
      const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
      product: thisProduct.prepareCartProduct(),
      },
      }
      );
      thisProduct.element.dispatchEvent(event);
    }
    prepareCartProduct() {
      const thisProduct = this;
      const productSummary = {
        id: thisProduct.id,
        name: thisProduct.data.name,
        amount: thisProduct.amountWidget.value,
        priceSingle: thisProduct.priceSingle,
        price: thisProduct.priceSingle * thisProduct.amountWidget.value,
        params: thisProduct.prepareCartProductParams()

      };
      return productSummary;
    }
    prepareCartProductParams() {
      const thisProduct = this;
      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.dom.form);
      const params = {};
      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        params[paramId] = {
          label: param.label,
          options: {}
        };

        for(let optionId in param.options) {
          const option = param.options[optionId];
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          if(optionSelected) {
            params[paramId].options[optionId] = option.label;
          }
        }
      }
      return params;
    }

    initAccordion() {
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    /* START: add event listener to clickable trigger on event click */
      thisProduct.dom.accordionTrigger.addEventListener('click', function(event) {
      /* prevent default action for event */
      event.preventDefault();
      /* find active product (product that has active class) */
      const activeProduct = document.querySelector(select.all.menuProductsActive);
      /* if there is active product and it's not thisProduct.element, remove class active from it */
      if(activeProduct && activeProduct !== thisProduct.element){
        activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
      }
      /* toggle active class on thisProduct.element */
      thisProduct.dom.wrapper.classList.toggle(classNames.menuProduct.wrapperActive);
    });
    }
    initOrderForm() {
      const thisProduct = this;
      thisProduct.dom.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisProduct.processOrder();
      });
      for(let input of thisProduct.dom.formInputs) {
        input.addEventListener('change', function() {
          thisProduct.processOrder();
        });
      }
      thisProduct.dom.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }
    processOrder() {
      const thisProduct = this;
      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.dom.form);

      // set price to default price
      let price = thisProduct.data.price;

      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        for(let optionId in param.options) {
          const option = param.options[optionId];
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          const optionImage = thisProduct.dom.imageWrapper.querySelector('.' + paramId + '-' + optionId); // ('${paramId}-&{optionId}');
          if(optionSelected && !option.default) {
            price += option.price;
          }
          else if(!optionSelected && option.default) {
            price -= option.price;
          }
          if(optionImage) {
            if(optionSelected) {
              optionImage.classList.add(classNames.menuProduct.imageVisible);
            } else {
              optionImage.classList.remove(classNames.menuProduct.imageVisible);
            }

          }
        }
      }
      price *= thisProduct.amountWidget.value; // multiply price by amount
      thisProduct.priceSingle = price / thisProduct.amountWidget.value; // save single price
      thisProduct.dom.priceElem.innerHTML = price; 
    }
  }
  app.init();
}