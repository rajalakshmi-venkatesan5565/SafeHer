// Register page la save panna name ah inga kaatrom
document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('userName');
    if(name) {
        document.getElementById('displayName').innerText = name;
    }
});

// SOS button click aana
document.getElementById('sosBtn').addEventListener('click', () => {
    alert('SOS ACTIVATED! Sending alerts to emergency contacts...');
    // Hackathon ku aprm: window.location.href = 'sos.html';
});

// Journey button click aana
document.getElementById('journeyBtn').addEventListener('click', () => {
    alert('Safe Journey Timer will start here');
    // Hackathon ku aprm: window.location.href = 'journey.html';
});