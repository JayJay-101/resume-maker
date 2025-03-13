/**
 * DOM utility functions
 * Centralizes common DOM operations
 */

/**
 * Get DOM elements by ID and return an object with references
 * @param {Object} elementIds - Object with keys as property names and values as element IDs
 * @returns {Object} Object with references to DOM elements
 */
export function getDomElements(elementIds) {
  const elements = {};
  
  for (const [key, id] of Object.entries(elementIds)) {
    elements[key] = document.getElementById(id);
  }
  
  return elements;
}

/**
 * Create a DOM element with optional attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} options - Element options (attributes, classes, text, etc.)
 * @param {Array} children - Child elements to append
 * @returns {HTMLElement} Created element
 */
export function createElement(tag, options = {}, children = []) {
  const element = document.createElement(tag);
  
  // Add classes
  if (options.className) {
    if (Array.isArray(options.className)) {
      element.classList.add(...options.className);
    } else {
      element.classList.add(options.className);
    }
  }
  
  // Set attributes
  if (options.attributes) {
    for (const [attr, value] of Object.entries(options.attributes)) {
      element.setAttribute(attr, value);
    }
  }
  
  // Set text content
  if (options.textContent) {
    element.textContent = options.textContent;
  }
  
  // Set innerHTML (use with caution)
  if (options.innerHTML) {
    element.innerHTML = options.innerHTML;
  }
  
  // Add event listeners
  if (options.events) {
    for (const [event, listener] of Object.entries(options.events)) {
      element.addEventListener(event, listener);
    }
  }
  
  // Append children
  children.forEach(child => {
    if (child) {
      element.appendChild(child);
    }
  });
  
  return element;
}

/**
 * Create a button element
 * @param {string} text - Button text
 * @param {string} className - Button CSS class
 * @param {Function} onClick - Click event handler
 * @returns {HTMLElement} Button element
 */
export function createButton(text, className, onClick) {
  return createElement('button', {
    className,
    textContent: text,
    events: { click: onClick }
  });
}

/**
 * Create an icon button (button with an icon)
 * @param {string} iconClass - Font Awesome icon class
 * @param {string} text - Button text
 * @param {string} className - Button CSS class
 * @param {Function} onClick - Click event handler
 * @returns {HTMLElement} Button with icon
 */
export function createIconButton(iconClass, text, className, onClick) {
  const button = createElement('button', {
    className,
    events: { click: onClick }
  });
  
  const icon = createElement('i', { className: iconClass });
  button.appendChild(icon);
  
  if (text) {
    button.appendChild(document.createTextNode(' ' + text));
  }
  
  return button;
}

/**
 * Set the caret position at the end of a contenteditable element
 * @param {HTMLElement} element - The contenteditable element
 */
export function setCaretAtEnd(element) {
  const range = document.createRange();
  const selection = window.getSelection();
  
  range.selectNodeContents(element);
  range.collapse(false); // false means collapse to end
  
  selection.removeAllRanges();
  selection.addRange(range);
  
  element.focus();
}
