let cart = [];

function showTab(category, event) {
  // Hide both sections
  document.getElementById('drinks').classList.add('hidden');
  document.getElementById('food').classList.add('hidden');

  // Show selected category
  document.getElementById(category).classList.remove('hidden');

  // Get all tab buttons
  let buttons = document.querySelectorAll('.tab-button');

  // Remove active color from all buttons
  buttons.forEach(btn => btn.classList.remove('active', 'inactive'));

  // Apply color based on category
  if (category === 'drinks') {
      event.target.classList.add('active');
      event.target.classList.remove('inactive');
  } else {
      event.target.classList.add('active');
      event.target.classList.remove('inactive');
  }
}

// Function to select a size
function selectSize(button) {
    let sizes = button.parentElement.querySelectorAll(".size-btn");
    sizes.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
}

// Function to add an item to the cart
function addToCart(button) {
    let item = button.closest("li");
    let name = item.querySelector(".item-name").textContent;
    let price = item.querySelector(".item-price").textContent;
    let selectedSize = item.querySelector(".size-btn.selected")?.textContent;
    let quantityInput = item.querySelector(".quantity-input");
    let quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1; // Default to 1 if no input

    // Check if the item requires a size selection (for drinks)
    let requiresSize = item.querySelector(".size-btn"); // Checks if sizes exist
    if (requiresSize && !selectedSize) {
        showAddToCartPopup(button, "Select size first!", true);
        return;
    }

    // Add item to cart
    cart.push({ name, price, size: selectedSize || "", quantity });

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

// Function to show the cart when the user clicks the cart button
function showCart() {
    let cartModal = document.getElementById('cartModal');
    cartModal.classList.add('show');
    showCartContents();
}

// Function to close the cart
function closeCart() {
    let cartModal = document.getElementById('cartModal');
    cartModal.classList.remove('show');
}

// Function to display cart contents
function showCartContents() {
    let cartContents = document.getElementById('cartContents');
    cartContents.innerHTML = '';

    if (cart.length === 0) {
        cartContents.textContent = "Nothing has been added to the cart.";
    } else {
        cart.forEach(item => {
            let listItem = document.createElement('div');
            listItem.classList.add('cart-item');
            listItem.textContent = `${item.quantity} × ${item.name}` + (item.size ? ` (${item.size})` : "") + ` - ${item.price}`;
            cartContents.appendChild(listItem);
        });

        // Display total price
        let totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
        let totalDiv = document.createElement('div');
        totalDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;
        cartContents.appendChild(totalDiv);
    }
}

// Function to show a small popup near the clicked "Add to Cart" button
function showAddToCartPopup(button, message, isError = false) {
    let popup = document.createElement("div");
    popup.classList.add("cart-popup");
    popup.textContent = message;

    if (isError) {
        popup.classList.add("error"); // Add red styling for errors
    }

    // Position the popup near the button
    let rect = button.getBoundingClientRect();
    popup.style.top = `${rect.top + window.scrollY - 30}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;

    document.body.appendChild(popup);

    // Remove popup after 2 seconds
    setTimeout(() => {
        popup.remove();
    }, 2000);
}