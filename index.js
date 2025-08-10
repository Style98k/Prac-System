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

function saveOrderToDatabase(order, total) {
    const email = document.getElementById('email').value;
    const data = { email, order, total };
    localStorage.setItem('orderData', JSON.stringify(data));
}

function checkout() {
    const total = document.getElementById('totalPrice').innerText;
    alert(`The total of your order is ₱${total}. Please fill out your information.`);
    // Switch to Customer Info section
    showSection('customerSection');
    // Display total in customer info
    document.getElementById('customerTotal').innerText = `Total: ₱${total}`;
}

function showSection(sectionId) {
    const sections = ['menuSection', 'orderSection', 'customerSection', 'aboutSection'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = id === sectionId ? 'block' : 'none';
    });
    // Update sidebar active link if needed
    const sidebarLinks = document.querySelectorAll('.sidebar-content a');
    sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === sectionId);
    });
}

// Load sidebar.html
fetch('sidebar.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('sidebarContent').innerHTML = html;
        attachSidebarEvents(); // Attach events after loading
    });

function attachSidebarEvents() {
    const sections = {
        menuSection: document.getElementById('menuSection'),
        orderSection: document.getElementById('orderSection'),
        customerSection: document.getElementById('customerSection'),
        aboutSection: document.getElementById('aboutSection')
    };
    const sidebarLinks = document.querySelectorAll('.sidebar-content a');
    sidebarLinks.forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            Object.keys(sections).forEach(key => {
                sections[key].style.display = link.dataset.section === key ? 'block' : 'none';
            });
        };
    });
    // Default: show menu
    Object.keys(sections).forEach(key => {
        sections[key].style.display = key === 'menuSection' ? 'block' : 'none';
    });
}

// Sidebar open/close
const sidebar = document.getElementById('sidebar');
const sidebarIcon = document.getElementById('sidebarIcon');
sidebarIcon.onclick = () => {
    sidebar.classList.toggle('open');
};

// Load customer.html
fetch('customer.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('customerInfoContainer').innerHTML = html;
        // Attach customer info events here if needed
    });

function toggleCashInput() {
    const payment = document.getElementById('payment').value;
    const cashInputContainer = document.getElementById('cashInputContainer');
    cashInputContainer.style.display = payment === 'Cash' ? 'block' : 'none';
    document.getElementById('changeMsg').innerText = '';
    document.getElementById('cashAmount').value = '';
}

document.getElementById('payment').addEventListener('change', toggleCashInput);

document.getElementById('cashAmount').addEventListener('input', function() {
    const total = parseFloat(document.getElementById('totalPrice').innerText);
    const cash = parseFloat(this.value);
    const changeMsg = document.getElementById('changeMsg');
    if (isNaN(cash) || cash < total) {
        changeMsg.innerText = cash ? 'Not enough money.' : '';
        changeMsg.style.color = '#ff4d4d';
    } else {
        const change = cash - total;
        changeMsg.innerText = `Change: ₱${change}`;
        changeMsg.style.color = '#ffb347';
    }
});

function submitCustomerInfo() {
    const name = document.getElementById('name').value.trim();
    const feedback = document.getElementById('feedback').value.trim();
    const payment = document.getElementById('payment').value;
    const total = parseFloat(document.getElementById('totalPrice').innerText);

    if (!name) {
        alert('Please enter your name.');
        return;
    }

    if (payment === 'Cash') {
        const cash = parseFloat(document.getElementById('cashAmount').value);
        if (isNaN(cash) || cash < total) {
            alert('Not enough money.');
            return;
        }
        const change = cash - total;
        showThankYou(name, change);
    } else {
        showThankYou(name, 0);
    }

    // Optionally clear fields
    document.getElementById('name').value = '';
    document.getElementById('feedback').value = '';
    document.getElementById('payment').selectedIndex = 0;
    toggleCashInput();
}

function showThankYou(name, change) {
    const msg = change > 0
        ? `Thank you for ordering, ${name}! Your change is ₱${change}.`
        : `Thank you for ordering, ${name}!`;
    document.getElementById('thankYouMessage').style.display = 'block';
    document.getElementById('thankYouMessage').innerText = msg;
    setTimeout(() => {
        document.getElementById('thankYouMessage').style.display = 'none';
    }, 4000);
}

