/**
 * Skills.js
 * Handles the Skills section functionality
 */
import { BaseSection } from './BaseSection';
import { SECTION_TYPES } from '../../constants/sectionTypes';
import { createElement, setCaretAtEnd } from '../../utils/dom';

export class Skills extends BaseSection {
  constructor(sectionManager) {
    super(sectionManager, SECTION_TYPES.SKILL);
  }
  
  /**
   * Create a new skill category element
   * @returns {HTMLElement} The skill category element
   */
  createElement() {
    // Clone the skill category template
    const template = this.sectionManager.templates.skillCategory;
    if (!template) {
      console.error('Skill category template not found');
      return null;
    }
    
    const clone = this.sectionManager.cloneTemplate(template);
    return clone;
  }
  
  /**
   * Initialize a skill category element
   * @param {HTMLElement} element - The skill category element
   */
  initialize(element) {
    // Set up delete button
    this.sectionManager.setupDeleteButton(element.querySelector('.delete-button'));
    
    // Reset editable content
    this.sectionManager.resetEditableContent(element);
    
    // Set up add skill button
    this.setupAddSkillButton(element);
    
    return element;
  }
  
  /**
   * Initialize an existing skill category
   * @param {HTMLElement} category - The existing skill category element
   */
  initializeCategory(category) {
    this.setupAddSkillButton(category);
    
    // Initialize skill item events for existing skills
    const skillsList = category.querySelector('.skills-list');
    if (skillsList) {
      const skillItems = skillsList.querySelectorAll('.skill-item');
      skillItems.forEach((skill, index) => {
        this.setupSkillItemEvents(skill, index, skillsList);
      });
    }
  }
  
  /**
   * Set up the add skill button in a category
   * @param {HTMLElement} category - The skill category element
   */
  setupAddSkillButton(category) {
    const addSkillBtn = category.querySelector('.add-skill-btn');
    const skillsList = category.querySelector('.skills-list');
    
    if (addSkillBtn && skillsList) {
      addSkillBtn.addEventListener('click', () => this.addSkill(skillsList));
    }
    
    // Set up event listeners for all existing skills in this category
    const existingSkills = skillsList ? skillsList.querySelectorAll('.skill-item') : [];
    existingSkills.forEach((skill, index) => {
      this.setupSkillItemEvents(skill, index, skillsList);
    });
  }
  
  /**
   * Add a new skill to a skills list
   * @param {HTMLElement} skillsList - The skills list element
   * @param {string} text - The skill text
   * @param {HTMLElement} insertBefore - Element to insert before (optional)
   * @returns {HTMLElement} The new skill element
   */
  addSkill(skillsList, text = 'New Skill', insertBefore = null) {
    const newSkill = createElement('span', {
      className: 'skill-item',
      attributes: { contenteditable: 'true' },
      textContent: text
    });
    
    // Insert at specific position or append
    if (insertBefore) {
      skillsList.insertBefore(newSkill, insertBefore);
    } else {
      skillsList.appendChild(newSkill);
    }
    
    // Setup event listeners for the new skill
    const index = Array.from(skillsList.querySelectorAll('.skill-item')).indexOf(newSkill);
    this.setupSkillItemEvents(newSkill, index, skillsList);
    
    return newSkill;
  }
  
  /**
   * Set up event listeners for a skill item
   * @param {HTMLElement} skillItem - The skill item element
   * @param {number} index - The index of the skill item
   * @param {HTMLElement} skillsList - The parent skills list
   */
  setupSkillItemEvents(skillItem, index, skillsList) {
    // Flag to prevent duplicate processing
    let processingPaste = false;
    
    // Handle backspace to delete empty skills (except the first one)
    skillItem.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && skillItem.textContent.trim() === '') {
        // Don't delete if it's the first skill
        if (skillItem === skillsList.querySelector('.skill-item:first-child')) {
          return;
        }
        
        e.preventDefault();
        
        // Get all skills BEFORE removing the current one
        const allSkills = Array.from(skillsList.querySelectorAll('.skill-item'));
        const currentIndex = allSkills.indexOf(skillItem);
        
        if (currentIndex > 0) {
          const prevSkill = allSkills[currentIndex - 1];
          
          // Remove the current skill
          skillItem.remove();
          
          // Focus the previous skill
          setTimeout(() => {
            setCaretAtEnd(prevSkill);
          }, 10);
        }
      }
    });
    
    // Handle comma to create new skills
    skillItem.addEventListener('input', (e) => {
      // Ignore if we're processing a paste operation
      if (processingPaste) return;
      
      const content = skillItem.textContent;
      
      if (content.includes(',')) {
        const parts = content.split(',');
        skillItem.textContent = parts[0].trim();
        
        // Create new skills for each part after the comma
        let currentSkill = skillItem;
        for (let i = 1; i < parts.length; i++) {
          const partText = parts[i].trim();
          if (partText) {
            const nextSkill = this.addSkill(
              skillsList, 
              partText, 
              currentSkill.nextElementSibling
            );
            currentSkill = nextSkill;
          }
        }
        
        // Focus the last created skill
        setTimeout(() => {
          setCaretAtEnd(currentSkill);
        }, 10);
      }
    });
    
    // Handle paste events to split by commas
    skillItem.addEventListener('paste', (e) => {
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      
      // Only handle special paste if it contains commas
      if (pastedText.includes(',')) {
        e.preventDefault();
        processingPaste = true;
        
        // Count the existing skills before paste for duplication check
        const existingSkillCount = skillsList.querySelectorAll('.skill-item').length;
        
        // Find the position of this skill in the list
        const skillsArray = Array.from(skillsList.querySelectorAll('.skill-item'));
        const skillPosition = skillsArray.indexOf(skillItem);
        
        // Parse the pasted content
        const parts = pastedText.split(',').map(part => part.trim()).filter(part => part);
        const pastedItemCount = parts.length;
        
        // Expected total: existing skills, minus the one being replaced, plus new pasted parts
        const expectedTotalSkills = existingSkillCount - 1 + pastedItemCount;
        
        if (parts.length > 0) {
          // Set the first part to this skill
          skillItem.textContent = parts[0];
          
          // Create new skills for each additional part
          let currentSkill = skillItem;
          for (let i = 1; i < parts.length; i++) {
            const nextSkill = this.addSkill(
              skillsList, 
              parts[i], 
              currentSkill.nextElementSibling
            );
            currentSkill = nextSkill;
          }
          
          // Focus the last created skill and check for duplications
          setTimeout(() => {
            // Check for duplications
            const actualSkillCount = skillsList.querySelectorAll('.skill-item').length;
            
            if (actualSkillCount > expectedTotalSkills) {
              // We have duplications! Remove the extras
              const extraCount = actualSkillCount - expectedTotalSkills;
              
              // Calculate where the duplicates start
              const duplicatesStartAt = skillPosition + pastedItemCount;
              
              // Remove the duplicates
              const currentSkills = Array.from(skillsList.querySelectorAll('.skill-item'));
              for (let i = 0; i < extraCount; i++) {
                if (currentSkills[duplicatesStartAt + i]) {
                  currentSkills[duplicatesStartAt + i].remove();
                }
              }
            }
            
            // Now focus the proper skill based on the final structure
            const finalSkills = Array.from(skillsList.querySelectorAll('.skill-item'));
            const targetSkill = finalSkills[skillPosition + pastedItemCount - 1] || 
                             finalSkills[finalSkills.length - 1];
            
            if (targetSkill) {
              setCaretAtEnd(targetSkill);
            }
            
            // Reset the paste flag after everything is done
            setTimeout(() => {
              processingPaste = false;
            }, 100);
          }, 50);
        } else {
          processingPaste = false;
        }
      } else {
        // Just insert the text normally
        e.preventDefault();
        skillItem.textContent = pastedText;
        
        // Reset paste flag
        processingPaste = false;
      }
    });
  }
}
