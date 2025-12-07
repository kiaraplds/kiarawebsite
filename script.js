// Get elements
const beforeWidget = document.getElementById('beforeWidget');
const afterWidget = document.getElementById('afterWidget');
const transitionOverlay = document.getElementById('transitionOverlay');

// Before AI widget click handler (going back in time)
beforeWidget.addEventListener('click', () => {
    // Add backward animation class
    transitionOverlay.classList.add('backward');

    // Wait for animation to reach peak, then navigate
    setTimeout(() => {
        window.location.href = 'https://kiaraaplds.myportfolio.com/';
    }, 1600); // Navigate near the end of the 1.8s animation
});

// After AI widget click handler (going forward in time)
afterWidget.addEventListener('click', () => {
    // Add forward animation class
    transitionOverlay.classList.add('forward');

    // Wait for animation to complete, then navigate
    setTimeout(() => {
        window.location.href = 'after-ai.html';
    }, 1600); // Navigate near the end of the 1.8s animation
});

// Add hover sound effect (optional enhancement)
const widgets = document.querySelectorAll('.widget');
widgets.forEach(widget => {
    widget.addEventListener('mouseenter', () => {
        widget.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    });
});

// Chat functionality
const chatToggle = document.getElementById('chatToggle');
const chatContainer = document.getElementById('chatContainer');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

// Toggle chat
chatToggle.addEventListener('click', () => {
    chatContainer.classList.toggle('active');
    if (chatContainer.classList.contains('active')) {
        chatInput.focus();
        // Hide notification badge when chat is opened
        const notification = document.querySelector('.chat-notification');
        if (notification) {
            notification.style.display = 'none';
        }
    }
});

// Close chat
chatClose.addEventListener('click', () => {
    chatContainer.classList.remove('active');
});

// Send message function
function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;

    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message';
    userMessage.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(userMessage);

    // Clear input
    chatInput.value = '';

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Fun bot responses
    const responses = [
        "I appreciate the effort, but I'm literally just CSS and JavaScript 😅",
        "Bold of you to assume I can read! Try <a href='mailto:kiaraplds@hotmail.com'>email</a> instead ✉️",
        "I'm flattered, but I'm not that kind of chatbot. Real talk? <a href='https://www.linkedin.com/in/kiara-polychroniadi' target='_blank'>LinkedIn</a> me!",
        "Still here? Okay fine, send it to <a href='mailto:kiaraplds@hotmail.com'>kiaraplds@hotmail.com</a> 📧",
        "Look, I'm beautiful AND useless. <a href='https://www.linkedin.com/in/kiara-polychroniadi' target='_blank'>LinkedIn</a> is where the magic happens ✨"
    ];

    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot-message';
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        botMessage.innerHTML = `<p>${randomResponse}</p>`;
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
}

// Send on button click
chatSend.addEventListener('click', sendMessage);

// Send on Enter key
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
