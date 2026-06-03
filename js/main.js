document.addEventListener('DOMContentLoaded', () => {
    // Simple Countdown Logic
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl && hoursEl && minutesEl && secondsEl) {
        function updateCountdown() {
            const targetDate = new Date('July 19, 2027 18:00:00').getTime();
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                daysEl.innerText = days;
                hoursEl.innerText = hours;
                minutesEl.innerText = minutes;
                secondsEl.innerText = seconds;
            } else {
                daysEl.innerText = 0;
                hoursEl.innerText = 0;
                minutesEl.innerText = 0;
                secondsEl.innerText = 0;
            }
        }

        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // Reveal on scroll micro-interaction
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(section => {
        section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
        observer.observe(section);
    });

    // Real-time validation for amount input
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            const errorMsg = document.getElementById('error-msg');
            if (value >= 100) {
                errorMsg.classList.add('opacity-0');
                this.parentElement.classList.remove('border-error');
                this.parentElement.classList.add('border-primary');
            }
        });
    }

    // Admin Panel Login Toggle
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm && loginSection && dashboardSection && logoutBtn) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate authentication
            loginSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            dashboardSection.classList.add('flex');
        });

        logoutBtn.addEventListener('click', () => {
            dashboardSection.classList.add('hidden');
            dashboardSection.classList.remove('flex');
            loginSection.classList.remove('hidden');
            document.getElementById('password').value = '';
        });
    }
});

// Global function for form submission
function validateAmount() {
    const input = document.getElementById('amount');
    const errorMsg = document.getElementById('error-msg');
    const value = parseFloat(input.value);

    if (isNaN(value) || value < 100) {
        errorMsg.classList.remove('opacity-0');
        errorMsg.classList.add('opacity-100');
        input.parentElement.classList.add('border-error');
        input.parentElement.classList.remove('border-outline-variant');
    } else {
        errorMsg.classList.add('opacity-0');
        errorMsg.classList.remove('opacity-100');
        input.parentElement.classList.remove('border-error');
        input.parentElement.classList.add('border-primary');
        alert('Obrigado pelo seu carinho! Redirecionando para o pagamento...');
    }
}
