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
    
    // Switch to customer section
    showSection('customerSection');
    updateCustomerSection();
    
    if (orders.length > 0) {
        alert(`The total of your order is ₱${total}. Please fill out your information.`);
    }
}

function showSection(sectionId) {
    const sections = ['menuSection', 'orderSection', 'customerSection', 'aboutSection', 'contactSection'];
    
    // Hide all sections first
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = 'none';
        }
    });
    
    // Show the selected section
    if (sectionId === 'homeSection') {
        document.getElementById('homeSection').style.display = 'block';
    } else {
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.style.display = 'block';
        }
    }
    
    // Update sidebar active link
    const sidebarLinks = document.querySelectorAll('.sidebar-content a');
    sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === sectionId);
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load sidebar.html
fetch('sidebar.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('sidebarContent').innerHTML = html;
        attachSidebarEvents(); // Attach events after loading
    });

function attachSidebarEvents() {
    const sidebarLinks = document.querySelectorAll('.sidebar-content a');
    sidebarLinks.forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            
            // Close sidebar after clicking
            document.getElementById('sidebar').classList.remove('open');
            
            showSection(sectionId);
            
            // Update customer section if needed
            if (sectionId === 'customerSection') {
                updateCustomerSection();
            }
        };
    });

    // Show home section by default when page loads
    showSection('homeSection');
}

function updateCustomerSection() {
    const customerOrderList = document.getElementById('customerOrderList');
    const customerTotal = document.getElementById('customerTotal');

    if (orders.length === 0) {
        // Show a message if no orders
        customerOrderList.innerHTML = '<div class="no-orders" style="text-align: center; padding: 20px; color: #bdbdbd;">No items in order yet. You can browse our menu to add items!</div>';
        customerTotal.style.display = 'none';
    } else {
        // Show order details if there are orders
        customerOrderList.innerHTML = '';
        orders.forEach(order => {
            const div = document.createElement('div');
            div.className = 'order-item';
            div.innerHTML = `
                <span>${order.item}</span>
                <span>₱${order.price}</span>
            `;
            customerOrderList.appendChild(div);
        });
        customerTotal.style.display = 'block';
        customerTotal.innerText = `Total Amount: ₱${total}`;
    }
}

// Sidebar open/close
const sidebar = document.getElementById('sidebar');
const sidebarIcon = document.getElementById('sidebarIcon');
sidebarIcon.onclick = (e) => {
    e.stopPropagation(); // Prevent click from bubbling up
    sidebar.classList.toggle('open');
};

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// Load customer.html
fetch('customer.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('customerInfoContainer').innerHTML = html;
        // Attach customer info events here if needed
    });

function togglePaymentInput() {
    const payment = document.getElementById('payment').value;
    const paymentContainers = {
        'Cash': document.getElementById('cashInputContainer'),
        'Gcash': document.getElementById('gcashInputContainer'),
        'PayPal': document.getElementById('paypalInputContainer')
    };

    // Hide all containers first
    Object.values(paymentContainers).forEach(container => {
        if (container) container.style.display = 'none';
    });

    // Show the selected payment container
    if (paymentContainers[payment]) {
        paymentContainers[payment].style.display = 'block';
    }

    // Reset cash input if switching from cash
    if (payment !== 'Cash') {
        document.getElementById('changeMsg').innerText = '';
        document.getElementById('cashAmount').value = '';
    }
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

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        const button = event.target;
        const originalText = button.innerText;
        button.innerText = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerText = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

