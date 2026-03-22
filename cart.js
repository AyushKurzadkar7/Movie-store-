let cart = [];

function addToCart(movie) {
    const existing = cart.find(item => item.id === movie.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...movie, qty: 1 });
    }
    updateCart();
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
}

function checkout() {
    if (cart.length === 0) return alert("Your cart is empty!");
    openCheckout();
}

function openCheckout() {
    // populate summary
    const list = document.getElementById("summary-list");
    list.innerHTML = "";
    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} x${item.qty}  —  ₹${item.price * item.qty}`;
        list.appendChild(li);
    });
    document.getElementById("summary-total").textContent = `Total: ₹${getTotal()}`;

    document.getElementById("checkout-modal").classList.add("show");

    // generate UPI QR for current total
    generateUpiQr(getTotal());

    // payment method toggle
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener("change", () => {
            document.getElementById("card-fields").style.display = radio.value === "card" ? "flex" : "none";
            document.getElementById("upi-fields").style.display  = radio.value === "upi"  ? "flex" : "none";
            document.getElementById("cod-fields").style.display  = radio.value === "cod"  ? "flex" : "none";
            document.getElementById("pay-btn").textContent = radio.value === "cod" ? "Place Order" : "Pay Now";
            if (radio.value === "upi") generateUpiQr(getTotal());
        });
    });
}

function closeCheckout() {
    document.getElementById("checkout-modal").classList.remove("show");
}

function processPayment() {
    const name  = document.getElementById("cust-name").value.trim();
    const email = document.getElementById("cust-email").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const method = document.querySelector('input[name="payment"]:checked').value;

    if (!name || !email || !phone) return alert("Please fill in all customer details.");

    if (method === "card") {
        const num  = document.getElementById("card-number").value.replace(/\s/g, "");
        const exp  = document.getElementById("card-expiry").value.trim();
        const cvv  = document.getElementById("card-cvv").value.trim();
        const cname = document.getElementById("card-name").value.trim();
        if (num.length !== 16 || !/^\d+$/.test(num)) return alert("Enter a valid 16-digit card number.");
        if (!/^\d{2}\/\d{2}$/.test(exp)) return alert("Enter expiry as MM/YY.");
        if (cvv.length !== 3 || !/^\d+$/.test(cvv)) return alert("Enter a valid 3-digit CVV.");
        if (!cname) return alert("Enter name on card.");
    }

    if (method === "upi") {
        const upi = document.getElementById("upi-id").value.trim();
        if (!upi.includes("@")) return alert("Enter a valid UPI ID.");
    }

    if (method === "cod") {
        const addr = document.getElementById("cod-address").value.trim();
        if (!addr) return alert("Enter delivery address.");
    }

    const methodLabel = { card: "Credit/Debit Card", upi: "UPI", cod: "Cash on Delivery" };
    document.getElementById("success-msg").innerHTML =
        `Hi <strong>${name}</strong>, your order of <strong>₹${getTotal()}</strong> via <strong>${methodLabel[method]}</strong> is confirmed! Confirmation sent to <strong>${email}</strong>.`;

    closeCheckout();
    clearCart();
    toggleCart();
    document.getElementById("success-modal").classList.add("show");
}

function generateUpiQr(amount) {
    const upiString = `upi://pay?pa=moviestore@upi&pn=CINEstore&am=${amount}&cu=INR`;
    const encoded   = encodeURIComponent(upiString);
    const qrUrl     = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encoded}`;
    document.getElementById("upi-qr-img").src    = qrUrl;
    document.getElementById("upi-qr-amount").textContent = amount;
}

function closeSuccess() {
    document.getElementById("success-modal").classList.remove("show");
}

function getTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCart() {
    const cartEl    = document.getElementById("cart");
    const totalEl   = document.getElementById("total");
    const countEl   = document.getElementById("cart-count");

    cartEl.innerHTML = "";

    cart.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${item.name} x${item.qty}</span>
            <span>₹${item.price * item.qty}</span>
            <button class="remove-btn" data-id="${item.id}">✕</button>
        `;
        li.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(item.id));
        cartEl.appendChild(li);
    });

    totalEl.textContent = getTotal();
    countEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function openCart() {
    document.getElementById("cart-sidebar").classList.add("open");
    document.getElementById("overlay").classList.add("show");
}

function toggleCart() {
    document.getElementById("cart-sidebar").classList.toggle("open");
    document.getElementById("overlay").classList.toggle("show");
}
