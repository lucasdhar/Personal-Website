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

// Initialize
window.addEventListener('load', () => {
    loadModePreference();
});