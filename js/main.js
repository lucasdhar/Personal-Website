// Night/Light Mode Toggle
function toggleMode() {
    document.body.classList.toggle('light-mode');
    
    // Save preference
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('lightMode', isLight);
}

// Load saved mode preference
function loadModePreference() {
    const savedMode = localStorage.getItem('lightMode');
    if (savedMode === 'true') {
        document.body.classList.add('light-mode');
    }
}

// Load images - simplified for local development
function loadImages() {
    console.log('Image loading initialized');
}

// Tab switching functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const tabIndicator = document.getElementById('tabIndicator');
const body = document.body;

function updateTabIndicator(activeButton) {
    const buttonRect = activeButton.getBoundingClientRect();
    const switcherRect = activeButton.parentElement.getBoundingClientRect();
    const left = buttonRect.left - switcherRect.left;
    const width = buttonRect.width;
    
    tabIndicator.style.left = `${left}px`;
    tabIndicator.style.width = `${width}px`;
}

function switchTab(tabId) {
    // Hide all tab contents
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all buttons
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    const selectedTab = document.getElementById(`${tabId}-tab`);
    const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
    
    selectedTab.classList.add('active');
    selectedButton.classList.add('active');
    
    // Update tab indicator
    updateTabIndicator(selectedButton);

    // Update body class for styling
    if (tabId === 'model') {
        body.classList.add('model-active');
    } else {
        body.classList.remove('model-active');
    }
}

// Add click event listeners to tab buttons
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        switchTab(tabId);
    });
});

// Initialize
window.addEventListener('load', () => {
    loadModePreference();
    loadImages();
    const activeButton = document.querySelector('.tab-button.active');
    updateTabIndicator(activeButton);
});

// Update tab indicator on window resize
window.addEventListener('resize', () => {
    const activeButton = document.querySelector('.tab-button.active');
    updateTabIndicator(activeButton);
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
});