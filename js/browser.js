// Browser-style Portfolio System
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
    initializeChromeTabs();
    initializeDesktopIcons();
    initializeWindows();
    initializeTimeDisplay();
    updateTime();
    setInterval(updateTime, 1000);
});

// Chrome-style Tabs
function initializeChromeTabs() {
    const tabs = document.querySelectorAll('.chrome-tab');
    const engineerView = document.getElementById('engineerView');
    const modelView = document.getElementById('modelView');
    const body = document.body;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    function switchTab(tabId) {
        // Update tab appearance
        tabs.forEach(t => t.classList.remove('active'));
        const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Switch views
        if (tabId === 'engineer') {
            body.classList.remove('model-active');
            if (engineerView) {
                engineerView.classList.add('active');
            }
            if (modelView) {
                modelView.classList.remove('active');
            }
        } else if (tabId === 'model') {
            body.classList.add('model-active');
            if (engineerView) {
                engineerView.classList.remove('active');
            }
            if (modelView) {
                modelView.classList.add('active');
            }
            // Close all windows when switching to model mode
            closeAllWindows();
        }
    }
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
        const offset = (openWindows - 1) * 25;

        // Get the content to size the window appropriately
        const content = windowElement.querySelector('.window-content');

        // Set initial position
        const centerX = (window.innerWidth - 500) / 2 + offset;
        const centerY = (window.innerHeight - 400) / 2 + offset + 20; // +20 for tabs

        windowElement.style.left = `${Math.max(20, centerX)}px`;
        windowElement.style.top = `${Math.max(60, centerY)}px`;

        bringToFront(windowElement);

        // Remove opening animation class after animation
        setTimeout(() => {
            windowElement.classList.remove('opening');
        }, 200);
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
    window.style.top = `${Math.max(40, Math.min(y, maxY))}px`; // Min 40 for tabs
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
        timeDisplay.setAttribute('data-format', use24Hour ? '24' : '12');
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
        if (rect.top < 40) {
            window.style.top = '60px';
        }
        if (rect.right > window.innerWidth) {
            window.style.left = `${window.innerWidth - rect.width - 20}px`;
        }
        if (rect.bottom > window.innerHeight) {
            window.style.top = `${window.innerHeight - rect.height - 20}px`;
        }
    });
});
