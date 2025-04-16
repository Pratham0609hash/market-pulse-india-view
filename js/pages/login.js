
// login.js - JavaScript for the login page

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple validation
        if (!email || !password) {
            showError('Please enter both email and password.');
            return;
        }
        
        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Signing in...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // For demo purposes, only accept demo credentials
            if (email === 'demo@example.com' && password === 'password') {
                // Successful login - in a real app, you'd store a token here
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                // Show error
                showError('Invalid email or password. Try demo@example.com / password');
                submitButton.textContent = 'Sign in';
                submitButton.disabled = false;
            }
        }, 1000);
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});
