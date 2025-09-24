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
      else alert("❌ Failed to send Order!");
    })
    .catch(() => alert("❌ Failed to send Order!"));
}

// Save order to localStorage
function saveOrder(order) {
  let orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.unshift(order); // Add new order to beginning
  localStorage.setItem("orders", JSON.stringify(orders));
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

    const today = new Date().toISOString().slice(0, 10);
    const orderId = Date.now(); // Unique ID using timestamp

    // Compose Telegram message
    const message = `🆕 New Order
Category: ${category}
Service: ${service}
Link: ${link}
Quantity: ${quantity}`;

    sendTelegramMessage(message);

    // Create order object
    const order = {
      id: orderId,
      date: today,
      link,
      charge: 0, // You can calculate price here if you want
      quantity,
      service: `${category} ${service}`,
      status: "Pending",
    };

    saveOrder(order);

    alert("✅ Order placed successfully!");

    this.reset();
  });
}
