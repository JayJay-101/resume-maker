/**
 * DragDropManager.js
 * Handles drag and drop functionality
 */
export class DragDropManager {
  /**
   * Create a new DragDropManager
   * @param {SectionManager} sectionManager - Reference to the section manager
   */
  constructor(sectionManager) {
    this.sectionManager = sectionManager;
    this.draggedElement = null;
  }
  
  /**
   * Initialize the drag and drop manager
   */
  init() {
    // Most of the drag and drop functionality is implemented in LayoutManager
    // This class mainly serves as a service that can be extended in the future
    // with more advanced drag and drop capabilities
    
    document.addEventListener('dragstart', this.handleDragStart.bind(this));
    document.addEventListener('dragend', this.handleDragEnd.bind(this));
  }
  
  /**
   * Handle drag start event
   * @param {DragEvent} event - The drag event
   */
  handleDragStart(event) {
    const draggedElement = event.target.closest('[draggable="true"]');
    if (draggedElement) {
      this.draggedElement = draggedElement;
      
      // Add dragging class after a short delay to avoid flickering
      setTimeout(() => {
        if (this.draggedElement) {
          this.draggedElement.classList.add('dragging');
        }
      }, 0);
      
      // Set data transfer
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', ''); // Required for Firefox
    }
  }
  
  /**
   * Handle drag end event
   * @param {DragEvent} event - The drag event
   */
  handleDragEnd(event) {
    if (this.draggedElement) {
      this.draggedElement.classList.remove('dragging');
      this.draggedElement = null;
    }
  }
  
  /**
   * Calculate the element to insert the dragged element after
   * @param {HTMLElement} container - The container element
   * @param {number} y - The Y coordinate
   * @returns {HTMLElement} The element to insert after
   */
  getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll('[draggable="true"]:not(.dragging)')
    ];
    
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
}
