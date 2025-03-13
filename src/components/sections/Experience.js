/**
 * Experience.js
 * Handles the Experience section functionality
 */
import { BaseSection } from './BaseSection';
import { SECTION_TYPES } from '../../constants/sectionTypes';
import { createElement } from '../../utils/dom';

export class Experience extends BaseSection {
  constructor(sectionManager) {
    super(sectionManager, SECTION_TYPES.EXPERIENCE);
  }
  
  /**
   * Create a new experience item element
   * @returns {HTMLElement} The experience item element
   */
  createElement() {
    // Clone the experience item template
    const template = this.sectionManager.templates.experience;
    if (!template) {
      console.error('Experience template not found');
      return null;
    }
    
    const clone = this.sectionManager.cloneTemplate(template);
    return clone;
  }
  
  /**
   * Initialize an experience item element
   * @param {HTMLElement} element - The experience item element
   */
  initialize(element) {
    // Set up delete button
    this.sectionManager.setupDeleteButton(element.querySelector('.delete-button'));
    
    // Reset editable content
    this.sectionManager.resetEditableContent(element);
    
    // Set up add list item button
    const addListItemBtn = element.querySelector('.add-list-item');
    if (addListItemBtn) {
      addListItemBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.addListItem(addListItemBtn.parentNode);
      });
    }
    
    return element;
  }
}
