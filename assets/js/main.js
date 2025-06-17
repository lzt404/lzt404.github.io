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
        copyright: "&copy; 2025 lzt404."
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
    
    // Ensure long headers wrap properly on mobile
    adjustHeaderTextWrapping();
});

// Function to make sure header text wraps properly on mobile
function adjustHeaderTextWrapping() {
    const headerTitles = document.querySelectorAll('header h1');
    if (window.innerWidth <= 768) {
        headerTitles.forEach(title => {
            // Add multi-line ellipsis for very long titles on mobile
            if (title.textContent.length > 30 && window.innerWidth <= 480) {
                title.style.display = '-webkit-box';
                title.style.webkitLineClamp = '2';
                title.style.webkitBoxOrient = 'vertical';
                title.style.overflow = 'hidden';
                title.style.textOverflow = 'ellipsis';
            } else if (title.textContent.length > 20) {
                title.style.fontSize = '1.2rem';
                title.style.lineHeight = '1.3';
            }
        });
    } else {
        // Reset styles for larger screens
        headerTitles.forEach(title => {
            title.style.fontSize = '';
            title.style.lineHeight = '';
            title.style.display = '';
            title.style.webkitLineClamp = '';
            title.style.webkitBoxOrient = '';
            title.style.overflow = '';
            title.style.textOverflow = '';
        });
    }
}

// Update on resize and also when page content changes
window.addEventListener('resize', adjustHeaderTextWrapping);
document.addEventListener('DOMContentLoaded', adjustHeaderTextWrapping);
