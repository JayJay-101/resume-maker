/**
 * Education.js
 * Handles the Education section functionality
 */
import { BaseSection } from './BaseSection';
import { SECTION_TYPES } from '../../constants/sectionTypes';

export class Education extends BaseSection {
  constructor(sectionManager) {
    super(sectionManager, SECTION_TYPES.EDUCATION);
  }
  
  /**
   * Create a new education item element
   * @returns {HTMLElement} The education item element
   */
  createElement() {
    // Clone the education item template
    const template = this.sectionManager.templates.education;
    if (!template) {
      console.error('Education template not found');
      return null;
    }
    
    const clone = this.sectionManager.cloneTemplate(template);
    return clone;
  }
  
  /**
   * Initialize an education item element
   * @param {HTMLElement} element - The education item element
   */
  initialize(element) {
    // Set up delete button
    this.sectionManager.setupDeleteButton(element.querySelector('.delete-button'));
    
    // Reset editable content
    this.sectionManager.resetEditableContent(element);
    
    return element;
  }
}
