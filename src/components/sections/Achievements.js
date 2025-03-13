/**
 * Achievements.js
 * Handles the Achievements section functionality
 */
import { BaseSection } from './BaseSection';
import { SECTION_TYPES } from '../../constants/sectionTypes';
import { createElement } from '../../utils/dom';

export class Achievements extends BaseSection {
  constructor(sectionManager) {
    super(sectionManager, SECTION_TYPES.ACHIEVEMENT);
  }
  
  /**
   * Create a new achievement item element
   * @returns {HTMLElement} The achievement item element
   */
  createElement() {
    // Clone the achievement item template
    const template = this.sectionManager.templates.achievement;
    if (!template) {
      console.error('Achievement template not found');
      return null;
    }
    
    const clone = this.sectionManager.cloneTemplate(template);
    return clone;
  }
  
  /**
   * Initialize an achievement item element
   * @param {HTMLElement} element - The achievement item element
   */
  initialize(element) {
    // Set up delete button
    this.sectionManager.setupDeleteButton(element.querySelector('.delete-button'));
    
    // Reset editable content
    this.sectionManager.resetEditableContent(element);
    
    return element;
  }
  
  /**
   * Add a new achievement
   * @param {string} text - The achievement text
   * @returns {HTMLElement} The new achievement element
   */
  addAchievement(text = 'New achievement') {
    const achievementItem = createElement('div', {
      className: 'achievement-item',
    });
    
    // Add delete button
    const deleteBtn = createElement('button', {
      className: 'delete-button',
      textContent: '×',
      events: { click: () => achievementItem.remove() }
    });
    
    // Add achievement text
    const span = createElement('span', {
      attributes: { contenteditable: 'true' },
      textContent: text
    });
    
    achievementItem.appendChild(deleteBtn);
    achievementItem.appendChild(span);
    
    return achievementItem;
  }
}
