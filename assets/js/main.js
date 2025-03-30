// Theme handling
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.textContent = '🌙';
    }
}

// Back to top functionality
window.onscroll = function() {
    const backToTop = document.querySelector('.back-to-top');
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
};

// Site configuration
const siteConfig = {
    header: {
        title: "欢迎大佬的光临",
    },
    footer: {
        copyright: "&copy; 2024 lzt404."
    }
};

// Initialize page content
document.addEventListener('DOMContentLoaded', function() {
    // Set header content
    const headerTitle = document.querySelector('header h1');
    if (headerTitle) {
        headerTitle.textContent = siteConfig.header.title;
    }
    
    // Set footer content
    const footerCopyright = document.querySelector('footer p');
    if (footerCopyright) {
        footerCopyright.innerHTML = siteConfig.footer.copyright;
    }

    // Add click handler for back to top
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
    }
});
