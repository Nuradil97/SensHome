function fetchData() {
    fetch('/data')
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('temperature').textContent =
                data.temperature !== null ? data.temperature.toFixed(1) : 'N/A';
            document.getElementById('humidity').textContent =
                data.humidity !== null ? data.humidity.toFixed(1) : 'N/A';
            document.getElementById('battery').textContent =
                data.battery !== null ? data.battery.toFixed(2) : 'N/A';
            document.getElementById('motion').textContent = data.motion;
        })
        .catch((error) => console.error('Error fetching data:', error));
}

function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const validUsername = 'Write_your_username';
    const validPassword = 'Write_your_password';

    if (username === validUsername && password === validPassword) {
        document.querySelector('.login-container').classList.remove('active');
        document.querySelector('.dashboard-container').classList.add('active');
        fetchAlertState(); // Fetch the alert state on successful login
    } else {
        alert('Invalid username or password');
    }
}

// Fetch alert state from the server
function fetchAlertState() {
    fetch('/alert-state')
        .then((response) => response.json())
        .then((data) => {
            const toggleSwitch = document.getElementById('alertToggle');
            const toggleStatus = document.getElementById('toggleStatus');

            toggleSwitch.checked = data.alertState;
            toggleStatus.textContent = data.alertState ? 'Alerts are ON' : 'Alerts are OFF';
        })
        .catch((error) => console.error('Error fetching alert state:', error));
}

// Update alert state on the server
function updateAlertState(state) {
    fetch('/alert-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Alert state updated:', data);
        })
        .catch((error) => console.error('Error updating alert state:', error));
}

// Handle toggle switch changes
const toggleSwitch = document.getElementById('alertToggle');
const toggleStatus = document.getElementById('toggleStatus');

toggleSwitch.addEventListener('change', () => {
    const newState = toggleSwitch.checked;
    toggleStatus.textContent = newState ? 'Alerts are ON' : 'Alerts are OFF';
    updateAlertState(newState); // Update the server with the new state
});

setInterval(fetchData, 5000);

fetchData();