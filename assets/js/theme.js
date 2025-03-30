function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        updateThemeButton('☀️');
    }
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

// 自动初始化
document.addEventListener('DOMContentLoaded', initTheme);
