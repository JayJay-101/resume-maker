/**
 * Custom.js
 * Handles the Custom section functionality
 */
import { BaseSection } from './BaseSection';
import { SECTION_TYPES } from '../../constants/sectionTypes';
import { createElement, createButton, createIconButton } from '../../utils/dom';

export class Custom extends BaseSection {
  constructor(sectionManager) {
    super(sectionManager, SECTION_TYPES.CUSTOM);
  }
  
  /**
   * Create a new custom section element
   * @returns {HTMLElement} The custom section element
   */
  createElement() {
    // Create the custom section element
    const section = createElement('div', {
      className: 'section custom-section',
      attributes: { 'data-section-type': 'custom' }
    });
    
    // Add delete button for the entire section
    const deleteBtn = createElement('button', {
      className: 'delete-button',
      textContent: '×',
      events: { click: () => section.remove() }
    });
    
    // Add section title
    const title = createElement('h2', {
      className: 'section-title',
      attributes: { contenteditable: 'true' },
      textContent: 'Custom Section'
    });
    
    // Add section content container
    const content = createElement('div', {
      className: 'section-content',
      attributes: { id: `custom-container-${Date.now()}` }
    });
    
    // Add a default item
    const item = this.createCustomItem();
    
    // Add button to add more items
    const addButton = createElement('div', {
      className: 'add-button',
      innerHTML: '<i class="fas fa-plus"></i> Add Item',
      events: { 
        click: () => {
          const newItem = this.createCustomItem();
          content.appendChild(newItem);
        }
      }
    });
    
    // Assemble the section
    section.appendChild(deleteBtn);
    section.appendChild(title);
    section.appendChild(content);
    content.appendChild(item);
    section.appendChild(addButton);
    
    return section;
  }
  
  /**
   * Initialize a custom section element
   * @param {HTMLElement} element - The custom section element
   */
  initialize(element) {
    // Already initialized in createElement
    return element;
  }
  
  /**
   * Create a custom item element
   * @returns {HTMLElement} The custom item element
   */
  createCustomItem() {
    const item = createElement('div', {
      className: 'custom-item'
    });
    
    // Add delete button
    const deleteBtn = createElement('button', {
      className: 'delete-button',
      textContent: '×',
      events: { click: () => item.remove() }
    });
    
    // Add header with title and date
    const header = createElement('div', {
      className: 'item-header'
    });
    
    const title = createElement('span', {
      className: 'custom-item-title',
      attributes: { contenteditable: 'true' },
      textContent: 'Item Title'
    });
    
    const date = createElement('span', {
      className: 'date',
      attributes: { contenteditable: 'true' },
      textContent: 'Date'
    });
    
    // Add description with bullet points
    const description = createElement('div', {
      className: 'description'
    });
    
    const list = createElement('ul', {
      className: 'description'
    });
    
    const listItem = createElement('li', {
      attributes: { contenteditable: 'true' },
      textContent: 'Enter a description point here'
    });
    
    // Add button to add more list items
    const addListItemBtn = createIconButton(
      'fas fa-plus',
      'Add Bullet Point',
      'add-list-item',
      (e) => {
        e.preventDefault();
        this.addListItem(list);
      }
    );
    
    // Assemble the item
    item.appendChild(deleteBtn);
    header.appendChild(title);
    header.appendChild(date);
    item.appendChild(header);
    list.appendChild(listItem);
    list.appendChild(addListItemBtn);
    description.appendChild(list);
    item.appendChild(description);
    
    return item;
  }
}
