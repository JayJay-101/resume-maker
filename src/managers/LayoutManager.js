/**
 * LayoutManager.js
 * Handles section arrangement UI and logic
 */
import { getDomElements } from '../utils/dom';

export class LayoutManager {
  /**
   * Create a new LayoutManager
   * @param {SectionManager} sectionManager - Reference to the section manager
   */
  constructor(sectionManager) {
    this.sectionManager = sectionManager;
    this.isArranging = false;
    this.draggedSection = null;
    
    // Get DOM elements for the arrangement UI
    this.elements = getDomElements({
      overlay: 'arrangement-overlay',
      leftColumnArrange: 'left-column-arrange',
      rightColumnArrange: 'right-column-arrange',
      leftColumn: 'left-column',
      rightColumn: 'right-column',
      saveArrangementBtn: 'save-arrangement',
      cancelArrangementBtn: 'cancel-arrangement',
      toggleArrangementBtn: 'toggle-arrangement'
    });
    
    this.leftColumnSlots = this.elements.leftColumnArrange.querySelector('.arrangement-slots');
    this.rightColumnSlots = this.elements.rightColumnArrange.querySelector('.arrangement-slots');
  }
  
  /**
   * Initialize the layout manager
   */
  init() {
    // Add event listeners for arrangement buttons
    this.elements.toggleArrangementBtn.addEventListener('click', () => this.toggleArrangementMode());
    this.elements.saveArrangementBtn.addEventListener('click', () => this.saveArrangement());
    this.elements.cancelArrangementBtn.addEventListener('click', () => this.cancelArrangement());
  }
  
  /**
   * Toggle arrangement mode
   */
  toggleArrangementMode() {
    this.isArranging = !this.isArranging;
    
    if (this.isArranging) {
      // Show the arrangement overlay
      this.elements.overlay.style.display = 'flex';
      
      // Load current sections into the arrangement UI
      this.populateArrangementUI();
      
      // Set up drag and drop for arrangement sections
      this.setupArrangementDragDrop();
    } else {
      // Hide the arrangement overlay
      this.elements.overlay.style.display = 'none';
    }
  }
  
  /**
   * Populate the arrangement UI with the current sections
   */
  populateArrangementUI() {
    // Clear current slots
    this.leftColumnSlots.innerHTML = '';
    this.rightColumnSlots.innerHTML = '';
    
    // Add sections from left column
    Array.from(this.elements.leftColumn.querySelectorAll('.section')).forEach(section => {
      const sectionTitle = section.querySelector('.section-title').textContent;
      const sectionType = section.getAttribute('data-section-type');
      
      // If section has no ID, assign one based on type for consistent reference
      if (!section.id) {
        section.id = `${sectionType}-section-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      
      this.addSectionToArrangementUI(sectionTitle, sectionType, this.leftColumnSlots, section.id);
    });
    
    // Add sections from right column
    Array.from(this.elements.rightColumn.querySelectorAll('.section')).forEach(section => {
      const sectionTitle = section.querySelector('.section-title').textContent;
      const sectionType = section.getAttribute('data-section-type');
      
      // If section has no ID, assign one based on type for consistent reference
      if (!section.id) {
        section.id = `${sectionType}-section-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      
      this.addSectionToArrangementUI(sectionTitle, sectionType, this.rightColumnSlots, section.id);
    });
  }
  
  /**
   * Add a section to the arrangement UI
   * @param {string} title - The section title
   * @param {string} type - The section type
   * @param {HTMLElement} container - The container to add the section to
   * @param {string} id - The section ID
   */
  addSectionToArrangementUI(title, type, container, id) {
    const section = document.createElement('div');
    section.className = 'arrangement-section';
    section.setAttribute('draggable', 'true');
    section.setAttribute('data-section-type', type);
    section.setAttribute('data-section-id', id);
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    section.appendChild(titleEl);
    
    container.appendChild(section);
  }
  
  /**
   * Set up drag and drop for arrangement sections
   */
  setupArrangementDragDrop() {
    const sections = document.querySelectorAll('.arrangement-section');
    
    sections.forEach(section => {
      section.addEventListener('dragstart', (e) => {
        this.draggedSection = section;
        setTimeout(() => {
          section.classList.add('dragging');
        }, 0);
      });
      
      section.addEventListener('dragend', () => {
        section.classList.remove('dragging');
        this.draggedSection = null;
      });
    });
    
    const containers = [this.leftColumnSlots, this.rightColumnSlots];
    
    containers.forEach(container => {
      container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = this.getDragAfterElement(container, e.clientY);
        if (this.draggedSection) {
          if (afterElement) {
            container.insertBefore(this.draggedSection, afterElement);
          } else {
            container.appendChild(this.draggedSection);
          }
        }
      });
    });
  }
  
  /**
   * Calculate the element to insert the dragged element after
   * @param {HTMLElement} container - The container element
   * @param {number} y - The Y coordinate
   * @returns {HTMLElement} The element to insert after
   */
  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.arrangement-section:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
  
  /**
   * Save the arrangement
   */
  saveArrangement() {
    // Get the new arrangement
    const leftColumnSections = Array.from(this.leftColumnSlots.querySelectorAll('.arrangement-section'));
    const rightColumnSections = Array.from(this.rightColumnSlots.querySelectorAll('.arrangement-section'));
    
    // First, collect all existing sections from both columns before clearing them
    const allSections = {};
    
    // Collect left column sections
    Array.from(this.elements.leftColumn.querySelectorAll('.section')).forEach(section => {
      const sectionType = section.getAttribute('data-section-type');
      const sectionId = section.id;
      allSections[sectionId || sectionType] = section;
    });
    
    // Collect right column sections
    Array.from(this.elements.rightColumn.querySelectorAll('.section')).forEach(section => {
      const sectionType = section.getAttribute('data-section-type');
      const sectionId = section.id;
      allSections[sectionId || sectionType] = section;
    });
    
    // Now it's safe to clear the columns because we have references to all sections
    this.elements.leftColumn.innerHTML = '';
    this.elements.rightColumn.innerHTML = '';
    
    // Move sections to their new positions in left column
    leftColumnSections.forEach(arrangementSection => {
      const sectionType = arrangementSection.getAttribute('data-section-type');
      const sectionId = arrangementSection.getAttribute('data-section-id');
      const key = sectionId || sectionType;
      
      if (allSections[key]) {
        this.elements.leftColumn.appendChild(allSections[key]);
      }
    });
    
    // Move sections to their new positions in right column
    rightColumnSections.forEach(arrangementSection => {
      const sectionType = arrangementSection.getAttribute('data-section-type');
      const sectionId = arrangementSection.getAttribute('data-section-id');
      const key = sectionId || sectionType;
      
      if (allSections[key]) {
        this.elements.rightColumn.appendChild(allSections[key]);
      }
    });
    
    // Create custom-sections-container in right column if it doesn't exist anymore
    if (!document.getElementById('custom-sections-container')) {
      const customSectionsContainer = document.createElement('div');
      customSectionsContainer.id = 'custom-sections-container';
      this.elements.rightColumn.appendChild(customSectionsContainer);
    }
    
    // Refresh container references in SectionManager after rearrangement
    this.sectionManager.refreshContainers();
    
    // Re-bind event listeners to add buttons and other elements
    this.rebindEventListeners();
    
    // Exit arrangement mode
    this.toggleArrangementMode();
  }
  
  /**
   * Rebind event listeners after rearrangement
   */
  rebindEventListeners() {
    // Re-bind event listeners to add buttons
    document.querySelectorAll('.add-list-item').forEach(button => {
      if (!button.hasAttribute('data-initialized')) {
        button.setAttribute('data-initialized', 'true');
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.sectionManager.addListItem(button.parentNode);
        });
      }
    });
    
    // Re-setup skill categories and their items
    document.querySelectorAll('.skill-category').forEach(category => {
      // Setup the add skill button
      this.sectionManager.initializeSkillCategory(category);
    });
  }
  
  /**
   * Cancel the arrangement without saving
   */
  cancelArrangement() {
    // Just exit arrangement mode without saving
    this.toggleArrangementMode();
  }
}
