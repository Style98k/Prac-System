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
    if (orders.length === 0) {
        alert('No items in order!');
    } else {
        alert(`Thank you! Your total is ₱${total}`);
        orders = [];
        total = 0;
        updateOrderList();
    }
}
