let cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve cart from localStorage

// Function to display items in the cart on the order page
function displayOrderItems() {
  const orderList = document.getElementById('order-list');
  const totalPriceElement = document.getElementById('total-price');
  
  orderList.innerHTML = ''; // Clear the list before adding new items
  
  let totalPrice = 0;
  
  // Check if the cart is empty
  if (cart.length === 0) {
    orderList.innerHTML = '<li>Your cart is empty.</li>';
    totalPriceElement.textContent = '0.00';
    return;
  }

  // Loop through the cart and create list items
  cart.forEach(item => {
    const listItem = document.createElement('li');
    listItem.classList.add('order-item');
    
    listItem.innerHTML = `
      <span class="order-item-name">${item.quantity} × ${item.name}${item.size ? ` (${item.size})` : ''}</span>
      <span class="order-item-price">$${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
    `;
    
    orderList.appendChild(listItem);
    
    totalPrice += parseFloat(item.price.replace('$', '')) * item.quantity;
  });
  
  // Display the total price
  totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Updated addToCart function to store items in the cart
function addToCart(button) {
    let item = button.closest("li");
    let name = item.querySelector(".item-name").textContent;
    let price = item.querySelector(".item-price").textContent;
    let selectedSize = item.querySelector(".size-btn.selected")?.textContent;
    let quantityInput = item.querySelector(".quantity-input");
    
    // Validate the quantity input if it exists
    if (quantityInput) {
        validateQuantity(quantityInput);
    }
    
    let quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1; // Default to 1 if no input

    // Check if the item requires a size selection (for drinks)
    let requiresSize = item.querySelector(".size-btn"); // Checks if sizes exist
    if (requiresSize && !selectedSize) {
        showAddToCartPopup(button, "Select size first!", true);
        return;
    }

    // Add item to cart
    cart.push({ name, price, size: selectedSize || "", quantity });

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count
    updateCartCount();

    // Show a temporary confirmation near the button
    let message = `${quantity} × ${name}` + (selectedSize ? ` (${selectedSize})` : "") + " added to cart!";
    showAddToCartPopup(button, message);
}

// Function to update the cart count in the button
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
}

// Ensure that the order page displays the cart items when the page loads
document.addEventListener("DOMContentLoaded", function() {
    console.log('Cart data:', cart); // Log cart to debug
    displayOrderItems();
});
