/**
 * BaseSection.js
 * Base class for all resume sections
 */
export class BaseSection {
  /**
   * Create a new section
   * @param {SectionManager} sectionManager - Reference to the section manager
   * @param {string} type - Section type
   */
  constructor(sectionManager, type) {
    this.sectionManager = sectionManager;
    this.type = type;
  }
  
  /**
   * Create a new section element (to be implemented by child classes)
   * @returns {HTMLElement} The section element
   */
  createElement() {
    throw new Error('createElement method must be implemented by child class');
  }
  
  /**
   * Initialize a section element (to be implemented by child classes)
   * @param {HTMLElement} element - The section element
   */
  initialize(element) {
    throw new Error('initialize method must be implemented by child class');
  }
  
  /**
   * Add a list item to a list
   * @param {HTMLElement} list - The list element
   * @param {string} text - The list item text
   */
  addListItem(list, text = 'New bullet point') {
    const newItem = document.createElement('li');
    newItem.contentEditable = 'true';
    newItem.textContent = text;
    
    // Insert before the add button if it exists
    const addButton = list.querySelector('.add-list-item');
    if (addButton) {
      list.insertBefore(newItem, addButton);
    } else {
      list.appendChild(newItem);
    }
    
    return newItem;
  }
}
