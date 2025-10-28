// Desktop Window Management System
let zIndexCounter = 100;
let activeWindow = null;

// Window state management
const windowState = {
    dragging: false,
    draggedWindow: null,
    offsetX: 0,
    offsetY: 0
};

// Initialize desktop on load
document.addEventListener('DOMContentLoaded', () => {
    initializeDesktop();
    updateTaskbarTime();
    setInterval(updateTaskbarTime, 1000);
});

function initializeDesktop() {
    // Setup desktop icons
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const windowId = icon.getAttribute('data-window');
            openWindow(windowId);
        });

        // Double click for faster response
        icon.addEventListener('dblclick', (e) => {
            e.preventDefault();
            const windowId = icon.getAttribute('data-window');
            openWindow(windowId);
        });
    });

    // Setup all windows
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

    minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        minimizeWindow(windowId);
    });

    maximizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMaximize(windowId);
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWindow(windowId);
    });

    // Setup dragging
    const header = windowElement.querySelector('.window-header');
    header.addEventListener('mousedown', (e) => {
        if (windowElement.classList.contains('maximized')) return;
        startDragging(windowElement, e);
    });

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
        const centerX = (window.innerWidth - 800) / 2 + offset;
        const centerY = (window.innerHeight - 600) / 2 + offset;

        windowElement.style.left = `${Math.max(20, centerX)}px`;
        windowElement.style.top = `${Math.max(20, centerY)}px`;
        windowElement.style.width = '800px';
        windowElement.style.height = '600px';

        bringToFront(windowElement);
        updateTaskbar();

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
    updateTaskbar();

    if (activeWindow === windowElement) {
        activeWindow = null;
    }
}

function minimizeWindow(windowId) {
    const windowElement = document.getElementById(`${windowId}-window`);
    if (!windowElement) return;

    windowElement.classList.add('minimized');
    updateTaskbar();
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

    updateTaskbar();
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
    window.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
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

function updateTaskbar() {
    const taskbarWindows = document.getElementById('taskbar-windows');
    taskbarWindows.innerHTML = '';

    const openWindows = document.querySelectorAll('.window.open');
    openWindows.forEach(window => {
        const windowId = window.getAttribute('data-window');
        const windowTitle = window.querySelector('.window-title').textContent.trim();
        const windowIcon = window.querySelector('.window-icon').textContent;
        const isMinimized = window.classList.contains('minimized');
        const isActive = window.classList.contains('active') && !isMinimized;

        const taskbarItem = document.createElement('div');
        taskbarItem.className = `taskbar-window ${isActive ? 'active' : ''}`;
        taskbarItem.innerHTML = `
            <span>${windowIcon}</span>
            <span>${windowTitle}</span>
        `;

        taskbarItem.addEventListener('click', () => {
            if (isMinimized) {
                // Restore from minimized
                window.classList.remove('minimized');
                bringToFront(window);
            } else if (isActive) {
                // Minimize if already active
                minimizeWindow(windowId);
            } else {
                // Bring to front if open but not active
                bringToFront(window);
            }
        });

        taskbarWindows.appendChild(taskbarItem);
    });
}

function updateTaskbarTime() {
    const timeElement = document.getElementById('taskbar-time');
    if (!timeElement) return;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    timeElement.textContent = timeString;
}

// Handle window resize
window.addEventListener('resize', () => {
    const windows = document.querySelectorAll('.window.open:not(.maximized)');
    windows.forEach(window => {
        const rect = window.getBoundingClientRect();

        // Adjust position if window is outside viewport
        if (rect.left < 0) {
            window.style.left = '20px';
        }
        if (rect.top < 0) {
            window.style.top = '20px';
        }
        if (rect.right > window.innerWidth) {
            window.style.left = `${window.innerWidth - rect.width - 20}px`;
        }
        if (rect.bottom > window.innerHeight - 60) {
            window.style.top = `${window.innerHeight - rect.height - 80}px`;
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Close active window with Escape
    if (e.key === 'Escape' && activeWindow) {
        const windowId = activeWindow.getAttribute('data-window');
        closeWindow(windowId);
    }
});
