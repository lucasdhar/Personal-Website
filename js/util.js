// Utility functions for the portfolio website

// DOM Helper Functions
const utils = {
    // Get element by ID
    getElementById: (id) => document.getElementById(id),
    
    // Get elements by class name
    getElementsByClass: (className) => document.querySelectorAll(`.${className}`),
    
    // Add class to element
    addClass: (element, className) => {
        if (element) element.classList.add(className);
    },
    
    // Remove class from element
    removeClass: (element, className) => {
        if (element) element.classList.remove(className);
    },
    
    // Toggle class on element
    toggleClass: (element, className) => {
        if (element) element.classList.toggle(className);
    },
    
    // Check if element has class
    hasClass: (element, className) => {
        return element ? element.classList.contains(className) : false;
    },
    
    // Local storage helpers
    storage: {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('Error saving to localStorage:', e);
            }
        },
        
        get: (key) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return null;
            }
        },
        
        remove: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('Error removing from localStorage:', e);
            }
        }
    },
    
    // Animation helpers
    animations: {
        fadeIn: (element, duration = 300) => {
            if (!element) return;
            element.style.opacity = '0';
            element.style.display = 'block';
            
            let opacity = 0;
            const timer = setInterval(() => {
                opacity += 50 / duration;
                if (opacity >= 1) {
                    clearInterval(timer);
                    opacity = 1;
                }
                element.style.opacity = opacity;
            }, 50);
        },
        
        fadeOut: (element, duration = 300) => {
            if (!element) return;
            let opacity = 1;
            const timer = setInterval(() => {
                opacity -= 50 / duration;
                if (opacity <= 0) {
                    clearInterval(timer);
                    element.style.display = 'none';
                    opacity = 0;
                }
                element.style.opacity = opacity;
            }, 50);
        }
    },
    
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}