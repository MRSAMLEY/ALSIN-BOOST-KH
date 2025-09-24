function sendTelegramMessage(message) {
  const botToken = "7530662027:AAGay6VXwq6VQJHePq1ytMl2aYjWFNdXN4w"; // Replace with your bot token
  const chatId = "8078410911"; // Replace with your chat ID

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  })
    .then((response) => {
      if (response.ok) alert("✅ Order placed successfully!");
      else alert("Order placed successfully");
    })
    .catch(() => alert("❌ Failed to send Order!"));
}

// Save order to localStorage
function saveOrder(order) {
  let orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.unshift(order); // Add new order to beginning
  localStorage.setItem("orders", JSON.stringify(orders));
}

// Function to get current balance or set default
function getBalance() {
  return parseFloat(localStorage.getItem("balance")) || 50.00; // Default $50 if none
}

// Function to update balance in localStorage
function updateBalance(newBalance) {
  localStorage.setItem("balance", newBalance.toFixed(2));
}

// Calculate charge based on quantity (example: $1 per unit)
function calculateCharge(quantity) {
  return Number(quantity) * 1.0; // Adjust pricing logic here
}

// Handle new order form submission
const orderForm = document.getElementById("orderForm");
if (orderForm) {
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const category = this.category.value;
    const service = this.service.value;
    const link = this.link.value;
    const quantity = this.quantity.value;

    const charge = calculateCharge(quantity);
    let currentBalance = getBalance();

    // Check if balance is enough
    if (charge > currentBalance) {
      alert("⚠️ Insufficient balance! Please add funds.\nប្រាក់មិនគ្រប់គ្រាន់! សូមបន្ថែមប្រាក់។");
      return; // Stop submission
    }

    // Deduct charge from balance
    currentBalance -= charge;
    updateBalance(currentBalance);

    const today = new Date().toISOString().slice(0, 10);
    const orderId = Date.now(); // Unique ID using timestamp

    // Compose Telegram message
    const message = `🆕 New Order
Category: ${category}
Service: ${service}
Link: ${link}
Quantity: ${quantity}
Charge: $${charge.toFixed(2)}
Remaining Balance: $${currentBalance.toFixed(2)}`;

    sendTelegramMessage(message);

    // Create order object
    const order = {
      id: orderId,
      date: today,
      link,
      charge,
      quantity,
      service: `${category} ${service}`,
      status: "Pending",
    };

    saveOrder(order);

    // Update balance display if you have an element showing it, e.g.
    const balanceSpan = document.querySelector('.balance span');
    if (balanceSpan) balanceSpan.textContent = `$${currentBalance.toFixed(2)}`;

    alert("✅ Order placed successfully!");

    this.reset();
  });
}
