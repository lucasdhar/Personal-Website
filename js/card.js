// Card Navigation and Tab System
document.addEventListener('DOMContentLoaded', () => {
    initializeCardNavigation();
    initializeTabSwitcher();
});

function initializeCardNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    const sections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            switchSection(sectionId);
        });
    });
}

function switchSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active from all nav buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Activate corresponding nav button
    const activeButton = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Scroll to top of card content
    const cardContent = document.querySelector('.card-content');
    if (cardContent) {
        cardContent.scrollTop = 0;
    }
}

function initializeTabSwitcher() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabIndicator = document.getElementById('tabIndicator');
    const body = document.body;
    const engineerNav = document.getElementById('engineerNav');

    // Initialize tab indicator position
    updateTabIndicator();

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    function switchTab(tabId) {
        // Update tab buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Update tab indicator
        updateTabIndicator();

        // Switch content tabs
        const contentTabs = document.querySelectorAll('.content-tab');
        contentTabs.forEach(tab => tab.classList.remove('active'));

        const targetTab = document.getElementById(`${tabId}-content`);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Update body class for styling
        if (tabId === 'model') {
            body.classList.add('model-active');
            if (engineerNav) {
                engineerNav.style.display = 'none';
            }
        } else {
            body.classList.remove('model-active');
            if (engineerNav) {
                engineerNav.style.display = 'flex';
            }
        }

        // Scroll to top
        const cardContent = document.querySelector('.card-content');
        if (cardContent) {
            cardContent.scrollTop = 0;
        }
    }

    function updateTabIndicator() {
        const activeButton = document.querySelector('.tab-button.active');
        if (!activeButton || !tabIndicator) return;

        const buttonRect = activeButton.getBoundingClientRect();
        const switcherRect = activeButton.parentElement.getBoundingClientRect();
        const left = buttonRect.left - switcherRect.left;
        const width = buttonRect.width;

        tabIndicator.style.left = `${left}px`;
        tabIndicator.style.width = `${width}px`;
    }

    // Update on window resize
    window.addEventListener('resize', updateTabIndicator);
}
