/**
 * Samovar Russian Restaurant - Shopping Cart & UI Interactions
 */

(function () {
  'use strict';

  // Tax Rate: 8.875%
  const TAX_RATE = 0.08875;

  // Cart State
  let cart = [];

  // DOM Elements
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBadge = document.getElementById('cart-badge');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTaxEl = document.getElementById('cart-tax');
  const cartTotalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const btnBrowseMenu = document.getElementById('btn-browse-menu');

  /**
   * Format number to currency string ($XX.XX)
   * @param {number} amount
   * @returns {string}
   */
  function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
  }

  /**
   * Toggle Shopping Cart Drawer Visibility
   * @param {boolean} open
   */
  function toggleCart(open) {
    if (open) {
      cartDrawer.classList.add('active');
      cartBackdrop.classList.add('active');
      cartDrawer.setAttribute('aria-hidden', 'false');
      cartBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      cartDrawer.classList.remove('active');
      cartBackdrop.classList.remove('active');
      cartDrawer.setAttribute('aria-hidden', 'true');
      cartBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  /**
   * Add Item to Cart
   * @param {string} id
   * @param {string} name
   * @param {number} price
   */
  function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: id,
        name: name,
        price: parseFloat(price),
        quantity: 1
      });
    }
    updateCartUI();
  }

  /**
   * Update Quantity of an Item
   * @param {string} id
   * @param {number} delta (-1 or 1)
   */
  function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartUI();
    }
  }

  /**
   * Remove Item from Cart
   * @param {string} id
   */
  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  }

  /**
   * Render Cart Items and Calculations
   */
  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    // Update Badge
    cartBadge.textContent = totalItems.toString();
    cartBadge.setAttribute('aria-label', `${totalItems} items in cart`);

    // Render Drawer Content
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-message">
          <span class="empty-icon">&#128722;</span>
          <p>Your shopping cart is currently empty.</p>
          <a href="#menu" class="btn btn-secondary btn-sm" id="btn-browse-menu">Browse Menu</a>
        </div>
      `;

      // Re-bind browse menu button inside empty state
      const newBrowseBtn = document.getElementById('btn-browse-menu');
      if (newBrowseBtn) {
        newBrowseBtn.addEventListener('click', function () {
          toggleCart(false);
        });
      }

      checkoutBtn.disabled = true;
    } else {
      let itemsHTML = '';
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        itemsHTML += `
          <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-details">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">${formatCurrency(item.price)} &times; ${item.quantity} = ${formatCurrency(itemTotal)}</div>
            </div>
            <div class="cart-item-actions">
              <button type="button" class="qty-btn btn-decrease" data-id="${item.id}" aria-label="Decrease quantity of ${item.name}">&minus;</button>
              <span class="qty-val">${item.quantity}</span>
              <button type="button" class="qty-btn btn-increase" data-id="${item.id}" aria-label="Increase quantity of ${item.name}">&plus;</button>
              <button type="button" class="remove-item-btn" data-id="${item.id}" aria-label="Remove ${item.name} from cart">&times;</button>
            </div>
          </div>
        `;
      });
      cartItemsContainer.innerHTML = itemsHTML;
      checkoutBtn.disabled = false;
    }

    // Update Summary Totals
    cartSubtotalEl.textContent = formatCurrency(subtotal);
    cartTaxEl.textContent = formatCurrency(tax);
    cartTotalEl.textContent = formatCurrency(total);
  }

  // Attach Event Listeners
  document.addEventListener('DOMContentLoaded', function () {
    // Open/Close Cart Drawer
    if (cartToggleBtn) {
      cartToggleBtn.addEventListener('click', function () {
        toggleCart(true);
      });
    }

    if (cartCloseBtn) {
      cartCloseBtn.addEventListener('click', function () {
        toggleCart(false);
      });
    }

    if (cartBackdrop) {
      cartBackdrop.addEventListener('click', function () {
        toggleCart(false);
      });
    }

    if (btnBrowseMenu) {
      btnBrowseMenu.addEventListener('click', function () {
        toggleCart(false);
      });
    }

    // Add to Cart buttons
    document.addEventListener('click', function (e) {
      const addBtn = e.target.closest('.btn-add-cart');
      if (addBtn) {
        const id = addBtn.getAttribute('data-id');
        const name = addBtn.getAttribute('data-name');
        const price = addBtn.getAttribute('data-price');
        addToCart(id, name, price);
        toggleCart(true);
      }

      // Quantity Increase
      const incBtn = e.target.closest('.btn-increase');
      if (incBtn) {
        const id = incBtn.getAttribute('data-id');
        updateQuantity(id, 1);
      }

      // Quantity Decrease
      const decBtn = e.target.closest('.btn-decrease');
      if (decBtn) {
        const id = decBtn.getAttribute('data-id');
        updateQuantity(id, -1);
      }

      // Remove item
      const removeBtn = e.target.closest('.remove-item-btn');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-id');
        removeFromCart(id);
      }
    });

    // Checkout alert
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function () {
        if (cart.length > 0) {
          alert('Thank you for your order! Samovar looks forward to serving you.');
          cart = [];
          updateCartUI();
          toggleCart(false);
        }
      });
    }
  });
})();
