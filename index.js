let total = 0;
let orders = [];

function addToOrder(item, price) {
    orders.push({ item, price });
    total += price;
    updateOrderList();
}

function updateOrderList() {
    const list = document.getElementById('orderList');
    const totalPrice = document.getElementById('totalPrice');

    list.innerHTML = '';
    orders.forEach(order => {
        const li = document.createElement('li');
        li.textContent = `${order.item} - ₱${order.price}`;
        list.appendChild(li);
    });

    totalPrice.textContent = total;
}

function checkout() {
    const emailInput = document.getElementById('email').value.trim();

    if (orders.length === 0) {
        alert('No items in order!');
        return;
    }

    if (!emailInput) {
        alert('Please enter your email before checkout.');
        return;
    }

    // Basic email validation (simple regex)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput)) {
        alert('Please enter a valid email address.');
        return;
    }

    alert(`Thank you for your order!\nTotal: ₱${total}\nConfirmation will be sent to: ${emailInput}`);

    // Clear order and total
    orders = [];
    total = 0;
    updateOrderList();

    // Clear email input
    document.getElementById('email').value = '';
}

