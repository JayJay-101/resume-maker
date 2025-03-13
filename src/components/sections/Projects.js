/**
 * Projects.js
 * Handles the Projects section functionality
 */
import { BaseSection } from './BaseSection';
import { SECTION_TYPES } from '../../constants/sectionTypes';

export class Projects extends BaseSection {
  constructor(sectionManager) {
    super(sectionManager, SECTION_TYPES.PROJECT);
  }
  
  /**
   * Create a new project item element
   * @returns {HTMLElement} The project item element
   */
  createElement() {
    // Clone the project item template
    const template = this.sectionManager.templates.project;
    if (!template) {
      console.error('Project template not found');
      return null;
    }
    
    const clone = this.sectionManager.cloneTemplate(template);
    return clone;
  }
  
  /**
   * Initialize a project item element
   * @param {HTMLElement} element - The project item element
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
