const buttons = document.querySelectorAll(".ingredient-buttons button");
const container = document.getElementById("recipeContainer");

const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const closeCartBtn = document.getElementById("closeCart");
const checkoutBtn = document.getElementById("checkoutBtn"); // NEW

let cart = [];

buttons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const choice = btn.dataset.choice;

    const res = await fetch(`/api/recipe?choice=${choice}`);
    const recipe = await res.json();

    if (!res.ok || !recipe) {
      alert("Sorry, that recipe isn't available yet!");
      return;
    }

    renderRecipe(recipe);
  });
});

function renderRecipe(recipe) {
  container.innerHTML = `
    <h2 id="recipeTitle">${recipe.name}</h2>
    <p id="recipePrice">$${recipe.price.toFixed(2)}</p>

    <button id="ingredientsButton">Show Ingredients</button>
    <button id="addToCartButton">Add to Cart</button>

    <div id="overlay">
      <div id="ingredientsDiv">
        <ul id="ingredientsList">
          <li>${recipe.ingredients.protein.name}, ${recipe.ingredients.protein.preparation}</li>
          <li>${recipe.ingredients.salsa.name}</li>
          ${recipe.ingredients.toppings
            .map((t) => `<li>${t.quantity} of ${t.name}</li>`)
            .join("")}
        </ul>
      </div>
    </div>
  `;

  const ingredientsButton = document.getElementById("ingredientsButton");
  const addToCartButton = document.getElementById("addToCartButton");
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("ingredientsDiv");

  ingredientsButton.addEventListener("click", () => {
    overlay.classList.add("active");
  });

  overlay.addEventListener("click", () => {
    overlay.classList.remove("active");
  });

  popup.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  addToCartButton.addEventListener("click", () => {
    addToCart(recipe);
  });
}


function addToCart(recipe) {
  const existing = cart.find((item) => item.id === recipe.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: recipe.id,
      name: recipe.name,
      price: recipe.price,
      qty: 1,
    });
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <li>
        ${item.name} x${item.qty} — $${(item.price * item.qty).toFixed(2)}
        <button class="remove-item" data-id="${item.id}">✕</button>
      </li>
    `
    )
    .join("");

  const total = calculateTotal();
  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = itemCount;

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.id);
    });
  });
}


cartToggle.addEventListener("click", () => {
  cartPanel.classList.add("active");
  cartOverlay.classList.add("active");
});

closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function closeCart() {
  cartPanel.classList.remove("active");
  cartOverlay.classList.remove("active");
}

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty! Add some tacos first 🌮");
    return;
  }

  const total = calculateTotal();
  alert(`Thank you for your order! 🌮\nTotal: $${total.toFixed(2)}\n\n(This is a demo no real payment was processed.)`); // NEW

  cart = [];
  renderCart();
  closeCart();
});