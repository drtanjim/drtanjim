 document.addEventListener('DOMContentLoaded', () => {
        const orderIdInput = document.getElementById('orderIdInput');
        const trackButton = document.getElementById('trackButton');
        const statusResultDiv = document.getElementById('statusResult');
        const errorMessageDiv = document.getElementById('errorMessage');

        // IMPORTANT: Replace this with your actual Google Apps Script Web App URL
        const API_URL = 'https://script.google.com/macros/s/AKfycbyiZRPE-NXEUn1kL61eZypx0BbbapElJpXDXaQBy3cvD2RhI4m4raZFX7V-CK0t0hrwXw/exec';

        const fetchOrderStatus = async (orderId) => {
            statusResultDiv.innerHTML = '<p>Fetching status...</p>';
            errorMessageDiv.textContent = ''; // Clear previous errors

            if (!orderId) {
                statusResultDiv.innerHTML = ''; // Clear fetching message
                errorMessageDiv.textContent = 'Please enter an Order ID.';
                return;
            }

            try {
                // Append the order ID as a query parameter
                const response = await fetch(`${API_URL}?id=${encodeURIComponent(orderId)}`);
                const data = await response.json();

                if (data.error) {
                    statusResultDiv.innerHTML = '';
                    errorMessageDiv.textContent = `API Error: ${data.error}`;
                    return;
                }

                if (data.length === 0) {
                    statusResultDiv.innerHTML = '';
                    errorMessageDiv.textContent = `Order ID "${orderId}" not found.`;
                } else {
                    const order = data[0]; // Assuming ID is unique, take the first result
                    statusResultDiv.innerHTML = `
                        <p><strong>Order ID:</strong> ${order.ID}</p>
                        <p><strong>Name:</strong> ${order.Name}</p>
                        <p><strong>Address:</strong> ${order.Address}</p>
                        <p><strong>Phone:</strong> ${order.Phone}</p>
                        <p><strong>Item/PDF:</strong> ${order['PDF Name']}</p>
                        <p><strong>Status:</strong> <span class="highlight-status">${order.Status}</span></p>
                    `;
                    errorMessageDiv.textContent = ''; // Clear any previous error
                }

            } catch (error) {
                console.error('Error fetching order status:', error);
                statusResultDiv.innerHTML = '';
                errorMessageDiv.textContent = 'Failed to fetch order status. Please try again later or check your network connection.';
            }
        };

        // Event listener for button click
        trackButton.addEventListener('click', () => {
            const orderId = orderIdInput.value.trim();
            fetchOrderStatus(orderId);
        });

        // Event listener for Enter key in input field
        orderIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const orderId = orderIdInput.value.trim();
                fetchOrderStatus(orderId);
            }
        });
    });
