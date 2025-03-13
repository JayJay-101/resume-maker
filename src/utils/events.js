/**
 * Events utility functions
 * Centralizes event handling
 */

/**
 * Debounce a function to limit how often it can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The wait time in milliseconds
 * @returns {Function} The debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function to limit how often it can be called
 * @param {Function} func - The function to throttle
 * @param {number} limit - The limit time in milliseconds
 * @returns {Function} The throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Add event listeners to multiple elements
 * @param {Array|NodeList} elements - The elements to add event listeners to
 * @param {string} event - The event name
 * @param {Function} handler - The event handler
 */
export function addEventListenerToAll(elements, event, handler) {
  if (!elements) return;
  
  const elementArray = Array.isArray(elements) ? elements : Array.from(elements);
  elementArray.forEach(element => {
    if (element) {
      element.addEventListener(event, handler);
    }
  });
}

/**
 * Remove event listeners from multiple elements
 * @param {Array|NodeList} elements - The elements to remove event listeners from
 * @param {string} event - The event name
 * @param {Function} handler - The event handler
 */
export function removeEventListenerFromAll(elements, event, handler) {
  if (!elements) return;
  
  const elementArray = Array.isArray(elements) ? elements : Array.from(elements);
  elementArray.forEach(element => {
    if (element) {
      element.removeEventListener(event, handler);
    }
  });
}

/**
 * Create a one-time event listener
 * @param {HTMLElement} element - The element to add the event listener to
 * @param {string} event - The event name
 * @param {Function} handler - The event handler
 */
export function once(element, event, handler) {
  const listener = (...args) => {
    handler(...args);
    element.removeEventListener(event, listener);
  };
  
  element.addEventListener(event, listener);
}
