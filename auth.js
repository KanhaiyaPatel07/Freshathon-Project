document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    registerTab.addEventListener('click', function() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    // Password strength indicator
    const passwordInput = document.getElementById('reg-password');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    passwordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        
        strengthBars.forEach((bar, index) => {
            if (index < strength) {
                bar.style.backgroundColor = index < 2 ? '#e63946' : '#2a9d8f';
            } else {
                bar.style.backgroundColor = '#e0e0e0';
            }
        });
        
        const strengthLabels = ['Weak', 'Fair', 'Strong', 'Very Strong'];
        strengthText.textContent = strengthLabels[Math.min(strength, 3)] || 'Weak';
    });

    // Form submissions
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Store authentication flag
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = 'home.html';
    });

    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const fname = document.getElementById('reg-fname').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Store authentication flag and user data
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', fname);
        window.location.href = 'home.html';
    });

    // Check if already authenticated
    if (localStorage.getItem('isAuthenticated')) {
        window.location.href = 'home.html';
    }
});