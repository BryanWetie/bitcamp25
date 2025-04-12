document.addEventListener("DOMContentLoaded", () => {
    const signinButton = document.getElementById('signin-button');
    const modal = document.getElementById('signin-modal');
    const closeModal = document.getElementById('close-modal');
    const signinForm = document.getElementById('signin-form');
  
    if (signinButton && modal && closeModal) {
      signinButton.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
      });
  
      closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
      });
  
      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    }
  
    // Handle sign-in form submission
    if (signinForm) {
      signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        
        // Simple validation
        if (email && password) {
          // In a real app, you would authenticate with a server here
          // For demo purposes, we'll just redirect to the profile page
          window.location.href = "profile.html";
        } else {
          alert("Please enter both email and password");
        }
      });
    }
  
    // Chatbot code only runs if all these exist
    const chatbotContainer = document.getElementById('chatbot-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
  
    if (sendButton && userInput && chatbotContainer) {
      sendButton.addEventListener('click', async () => {
        const userMessage = userInput.value;
        if (!userMessage) return;
  
        displayMessage(userMessage, 'user');
        userInput.value = '';
  
        try {
          const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
          });
  
          const data = await response.json();
          displayMessage(data.reply, 'bot');
        } catch (error) {
          // Fallback response if API fails
          displayMessage("I'm sorry, I couldn't process your request at the moment. Please try again later.", 'bot');
          console.error("Chatbot error:", error);
        }
      });
  
      function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatbotContainer.appendChild(messageElement);
        chatbotContainer.scrollTop = chatbotContainer.scrollHeight;
      }
    }
  
    const signupForm = document.getElementById('signup-form');
  
    if (signupForm) {
      signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
  
        const name = signupForm.querySelector('input[name="name"]').value.trim();
        const email = signupForm.querySelector('input[name="email"]').value.trim();
        const role = signupForm.querySelector('input[name="former-role"]').value.trim();
  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
        if (!name || !emailRegex.test(email) || !role) {
          alert("Please enter a valid name, email, and former role.");
          return;
        }
  
        // Store form data in localStorage to pre-populate profile page
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role);
  
        // Redirect to profile page after successful validation
        window.location.href = "profile.html";
      });
    }
  });
