function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        updateThemeButton('☀️');
    }
    
    // Ensure theme button is properly sized for the device
    adjustThemeButtonSize();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeButton(isDark ? '☀️' : '🌙');
}

function updateThemeButton(icon) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = icon;
    }
}

// Adjust theme button size based on device
function adjustThemeButtonSize() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle && window.innerWidth <= 480) {
        // Ensure the button is easily tappable on mobile
        themeToggle.style.padding = '8px';
        themeToggle.style.margin = '0 0 0 5px';
    }
}

// Listen for window resize events
window.addEventListener('resize', adjustThemeButtonSize);

// 自动初始化
document.addEventListener('DOMContentLoaded', initTheme);
