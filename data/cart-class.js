import { validDeliveryOption } from "./deliveryOptions.js";

class Cart {
  cartItem;
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItem = JSON.parse(localStorage.getItem(this.#localStorageKey));
  
    if (!this.cartItem) {
      this.cartItem = [{
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: '2'
      }];
    }
  }

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItem));
  }

  updateQuantity(productId, newQuantity) {
    let matchingItem;

  this.cartItem.forEach((cartItem) =>{
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;

  this.saveToStorage();
  }

  calculateCartQuantity() {
    let cartQuantity = 0;

    this.cartItem.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    
    return cartQuantity;
  }

  addToCart(productId) {
    let matchingItem;

    this.cartItem.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
      const quantity = Number(quantitySelector.value);
      
    if (matchingItem) {
        matchingItem.quantity += quantity;
    } else {
      this.cartItem.push({
        productId,
        quantity,
        deliveryOptionId: '1'
      });
    }

    const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

    addedMessage.classList.add('added-to-cart-visible');

    setTimeout(() => {
        addedMessage.classList.remove('added-to-cart-visible');
      }, 2000);
    
    this.saveToStorage();
  }

  removeFromCart(productId) {
    const newCart = [];
    this.cartItem.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });

    this.cartItem = newCart;

    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    this.cartItem.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if (!matchingItem) {
      return;
    }

    if (!validDeliveryOption(deliveryOptionId)) {
      return;
    }

    matchingItem.deliveryOptionId = deliveryOptionId;

    this.saveToStorage();
  }

  resetCart() {
    this.cartItem = [];
    this.saveToStorage();
  }
}

export const cart = new Cart('cart');

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log(xhr.response);
    fun();
  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}

export async function loadCartFetch() {
  const response = await fetch('https://supersimplebackend.dev/cart');
  const text = await response.text();
  console.log(text);
  return text;
}




