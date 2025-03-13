/**
 * SectionManager.js
 * Manages resume section creation, deletion, and updates
 */
import { Experience } from '../components/sections/Experience';
import { Education } from '../components/sections/Education';
import { Skills } from '../components/sections/Skills';
import { Projects } from '../components/sections/Projects';
import { Achievements } from '../components/sections/Achievements';
import { Custom } from '../components/sections/Custom';
import { SECTION_TYPES } from '../constants/sectionTypes';
import { getDomElements } from '../utils/dom';

export class SectionManager {
  constructor() {
    // Initialize section containers
    this.refreshContainers();
    
    // Factory for creating section instances
    this.sectionFactory = {
      [SECTION_TYPES.EXPERIENCE]: () => new Experience(this),
      [SECTION_TYPES.EDUCATION]: () => new Education(this),
      [SECTION_TYPES.ACHIEVEMENT]: () => new Achievements(this),
      [SECTION_TYPES.SKILL]: () => new Skills(this),
      [SECTION_TYPES.PROJECT]: () => new Projects(this),
      [SECTION_TYPES.CUSTOM]: () => new Custom(this)
    };
    
    // Store templates for section types
    this.templates = {};
  }
  
  refreshContainers() {
    // Store references to section containers
    this.containers = getDomElements({
      experience: 'experience-container',
      education: 'education-container',
      achievement: 'achievement-container',
      skill: 'skill-container',
      project: 'project-container',
      customSections: 'custom-sections-container'
    });
  }
  
  init() {
    // Store templates for each section type
    this.templates = {
      experience: document.querySelector('.experience-item'),
      education: document.querySelector('.education-item'),
      achievement: document.querySelector('.achievement-item'),
      skillCategory: document.querySelector('.skill-category'),
      project: document.querySelector('.project-item')
    };
    
    // Initialize existing sections
    this.initializeExistingSections();
  }
  
  initializeExistingSections() {
    // Set up delete buttons for existing items
    document.querySelectorAll('.delete-button').forEach(button => 
      this.setupDeleteButton(button));
    
    // Initialize skills for existing categories
    document.querySelectorAll('.skill-category').forEach(category => {
      this.initializeSkillCategory(category);
    });
    
    // Initialize list item buttons
    this.setupAddListItemButtons();
  }
  
  /**
   * Add a new section by type
   * @param {string} sectionType - The type of section to add from SECTION_TYPES
   */
  addSection(sectionType) {
    // Use the factory to create a new section instance
    const section = this.sectionFactory[sectionType]();
    if (!section) return;
    
    // Create the DOM element
    const element = section.createElement();
    
    // Add to the appropriate container
    if (this.containers[sectionType]) {
      this.containers[sectionType].appendChild(element);
    } else {
      console.error(`Container for ${sectionType} not found.`);
    }
    
    // Initialize event handlers and functionality for the new section
    section.initialize(element);
    
    return section;
  }
  
  /**
   * Helper method to set up delete button functionality
   * @param {HTMLElement} button - The delete button element
   */
  setupDeleteButton(button) {
    if (!button) return;
    
    // Find the closest parent item that should be deleted
    const parent = button.closest('.experience-item, .education-item, .achievement-item, .skill-category, .project-item, .custom-item, .section');
    
    if (parent) {
      button.addEventListener('click', () => parent.remove());
    }
  }
  
  /**
   * Helper method to initialize a skill category
   * @param {HTMLElement} category - The skill category element
   */
  initializeSkillCategory(category) {
    // Create a Skills instance to handle this category
    const skills = new Skills(this);
    skills.initializeCategory(category);
  }
  
  setupAddListItemButtons() {
    document.querySelectorAll('.add-list-item').forEach(button => {
      if (!button.hasAttribute('data-initialized')) {
        button.setAttribute('data-initialized', 'true');
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.addListItem(button.parentNode);
        });
      }
    });
  }
  
  addListItem(list) {
    const newItem = document.createElement('li');
    newItem.contentEditable = 'true';
    newItem.textContent = 'New bullet point';
    // Insert before the add button
    list.insertBefore(newItem, list.querySelector('.add-list-item'));
  }
  
  // Additional utility methods
  cloneTemplate(template) {
    return template.cloneNode(true);
  }
  
  resetEditableContent(element) {
    const editables = element.querySelectorAll('[contenteditable="true"]');
    editables.forEach(el => {
      if (el.classList.contains('position') || el.classList.contains('degree') || 
          el.classList.contains('project-name') || el.classList.contains('skill-category-title') ||
          el.classList.contains('custom-item-title')) {
        el.textContent = 'New Title';
      } else if (el.classList.contains('company') || el.classList.contains('school')) {
        el.textContent = 'Organization, Location';
      } else if (el.classList.contains('date')) {
        el.textContent = 'Date Range';
      } else if (el.classList.contains('skill-item')) {
        el.textContent = 'New Skill';
      } else if (el.tagName === 'LI') {
        el.textContent = 'New bullet point';
      } else if (el.tagName === 'P') {
        el.textContent = 'Enter description here';
      } else if (el.classList.contains('project-tech')) {
        el.textContent = 'Technologies used';
      } else if (el.parentNode && el.parentNode.classList.contains('achievement-item')) {
        el.textContent = 'New achievement';
      }
    });
  }
  
  /**
   * Get all major section elements
   * @returns {NodeList} All section elements
   */
  getAllSections() {
    return document.querySelectorAll('.section');
  }
}
