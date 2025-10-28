// Hybrid Portfolio System
// Combines card-based layout with popup windows

let zIndexCounter = 100;
let activeWindow = null;

// Window state management
const windowState = {
    dragging: false,
    draggedWindow: null,
    offsetX: 0,
    offsetY: 0
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeTabSwitcher();
    initializeDesktopIcons();
    initializeWindows();
    initializeTimeDisplay();
    updateTime();
    setInterval(updateTime, 1000);
});

// Tab Switcher
function initializeTabSwitcher() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabIndicator = document.getElementById('tabIndicator');
    const body = document.body;
    const engineerNav = document.getElementById('engineerNav');
    const modelContent = document.getElementById('modelContent');

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

        // Switch content
        if (tabId === 'model') {
            body.classList.add('model-active');
            if (engineerNav) {
                engineerNav.style.display = 'none';
            }
            if (modelContent) {
                modelContent.style.display = 'block';
            }
            // Close all windows when switching to model mode
            closeAllWindows();
        } else {
            body.classList.remove('model-active');
            if (engineerNav) {
                engineerNav.style.display = 'flex';
            }
            if (modelContent) {
                modelContent.style.display = 'none';
            }
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

// Desktop Icons (open popup windows)
function initializeDesktopIcons() {
    const iconButtons = document.querySelectorAll('.desktop-icon-btn');

    iconButtons.forEach(button => {
        button.addEventListener('click', () => {
            const windowId = button.getAttribute('data-window');
            openWindow(windowId);
        });
    });
}

// Window Management
function initializeWindows() {
    const windows = document.querySelectorAll('.window');

    windows.forEach(window => {
        setupWindow(window);
    });
}

function setupWindow(windowElement) {
    const windowId = windowElement.getAttribute('data-window');

    // Setup window controls
    const minimizeBtn = windowElement.querySelector('.window-btn.minimize');
    const maximizeBtn = windowElement.querySelector('.window-btn.maximize');
    const closeBtn = windowElement.querySelector('.window-btn.close');

    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            minimizeWindow(windowId);
        });
    }

    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMaximize(windowId);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeWindow(windowId);
        });
    }

    // Setup dragging
    const header = windowElement.querySelector('.window-header');
    if (header) {
        header.addEventListener('mousedown', (e) => {
            if (windowElement.classList.contains('maximized')) return;
            startDragging(windowElement, e);
        });
    }

    // Bring window to front on click
    windowElement.addEventListener('mousedown', () => {
        bringToFront(windowElement);
    });
}

function openWindow(windowId) {
    const windowElement = document.getElementById(`${windowId}-window`);
    if (!windowElement) return;

    if (windowElement.classList.contains('open')) {
        // If already open, just bring to front
        bringToFront(windowElement);
        windowElement.classList.remove('minimized');
    } else {
        // Open new window
        windowElement.classList.add('open', 'opening');
        windowElement.classList.remove('minimized');

        // Position window in center with slight offset based on open windows
        const openWindows = document.querySelectorAll('.window.open').length;
        const offset = (openWindows - 1) * 30;
        const centerX = (window.innerWidth - 600) / 2 + offset;
        const centerY = (window.innerHeight - 500) / 2 + offset + 30; // +30 for top bar

        windowElement.style.left = `${Math.max(20, centerX)}px`;
        windowElement.style.top = `${Math.max(20, centerY)}px`;
        windowElement.style.width = '600px';
        windowElement.style.height = '500px';

        bringToFront(windowElement);

        // Remove opening animation class after animation
        setTimeout(() => {
            windowElement.classList.remove('opening');
        }, 300);
    }
}

function closeWindow(windowId) {
    const windowElement = document.getElementById(`${windowId}-window`);
    if (!windowElement) return;

    windowElement.classList.remove('open', 'minimized', 'maximized');

    if (activeWindow === windowElement) {
        activeWindow = null;
    }
}

function closeAllWindows() {
    const windows = document.querySelectorAll('.window.open');
    windows.forEach(window => {
        const windowId = window.getAttribute('data-window');
        closeWindow(windowId);
    });
}

function minimizeWindow(windowId) {
    const windowElement = document.getElementById(`${windowId}-window`);
    if (!windowElement) return;

    windowElement.classList.add('minimized');
}

function toggleMaximize(windowId) {
    const windowElement = document.getElementById(`${windowId}-window`);
    if (!windowElement) return;

    if (windowElement.classList.contains('maximized')) {
        windowElement.classList.remove('maximized');
    } else {
        windowElement.classList.add('maximized');
    }
}

function bringToFront(windowElement) {
    zIndexCounter++;
    windowElement.style.zIndex = zIndexCounter;

    // Update active state
    document.querySelectorAll('.window').forEach(w => {
        w.classList.remove('active');
    });
    windowElement.classList.add('active');
    activeWindow = windowElement;
}

function startDragging(windowElement, e) {
    windowState.dragging = true;
    windowState.draggedWindow = windowElement;

    const rect = windowElement.getBoundingClientRect();
    windowState.offsetX = e.clientX - rect.left;
    windowState.offsetY = e.clientY - rect.top;

    bringToFront(windowElement);

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDragging);

    windowElement.style.cursor = 'grabbing';
    e.preventDefault();
}

function onDrag(e) {
    if (!windowState.dragging || !windowState.draggedWindow) return;

    const window = windowState.draggedWindow;
    const x = e.clientX - windowState.offsetX;
    const y = e.clientY - windowState.offsetY;

    // Keep window within bounds
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;

    window.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
    window.style.top = `${Math.max(60, Math.min(y, maxY))}px`; // Min 60 for top bar
}

function stopDragging() {
    if (windowState.draggedWindow) {
        windowState.draggedWindow.style.cursor = 'default';
    }

    windowState.dragging = false;
    windowState.draggedWindow = null;

    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDragging);
}

// Time Display
function initializeTimeDisplay() {
    const timeDisplay = document.getElementById('timeDisplay');
    if (!timeDisplay) return;

    // Make time display clickable to toggle format
    let use24Hour = true;
    timeDisplay.addEventListener('click', () => {
        use24Hour = !use24Hour;
        updateTime();
    });
    timeDisplay.setAttribute('data-format', '24');
}

function updateTime() {
    const timeDisplay = document.getElementById('timeDisplay');
    if (!timeDisplay) return;

    const now = new Date();
    const use24Hour = timeDisplay.getAttribute('data-format') === '24';

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    let timeString;
    if (use24Hour) {
        hours = hours.toString().padStart(2, '0');
        timeString = `${hours}:${minutes}:${seconds}`;
    } else {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        timeString = `${hours}:${minutes} ${ampm}`;
    }

    timeDisplay.textContent = timeString;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Close active window with Escape
    if (e.key === 'Escape' && activeWindow) {
        const windowId = activeWindow.getAttribute('data-window');
        closeWindow(windowId);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    const windows = document.querySelectorAll('.window.open:not(.maximized)');
    windows.forEach(window => {
        const rect = window.getBoundingClientRect();

        // Adjust position if window is outside viewport
        if (rect.left < 0) {
            window.style.left = '20px';
        }
        if (rect.top < 60) {
            window.style.top = '80px';
        }
        if (rect.right > window.innerWidth) {
            window.style.left = `${window.innerWidth - rect.width - 20}px`;
        }
        if (rect.bottom > window.innerHeight) {
            window.style.top = `${window.innerHeight - rect.height - 20}px`;
        }
    });
});
