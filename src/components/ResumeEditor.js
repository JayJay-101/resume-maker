/**
 * ResumeEditor.js
 * Main application class that initializes all managers and components
 */
import { PDFManager } from '../managers/PDFManager';
import { ContentManager } from '../managers/ContentManager';
import { SectionManager } from '../managers/SectionManager';
import { DragDropManager } from '../managers/DragDropManager';
import { LayoutManager } from '../managers/LayoutManager';
import { SECTION_TYPES } from '../constants/sectionTypes';

export class ResumeEditor {
  constructor() {
    // Initialize managers
    this.sectionManager = new SectionManager();
    this.contentManager = new ContentManager();
    this.dragDropManager = new DragDropManager(this.sectionManager);
    this.layoutManager = new LayoutManager(this.sectionManager);
    this.pdfManager = new PDFManager();
    
    // Initialize the application
    this.init();
  }
  
  init() {
    // Initialize all managers
    this.contentManager.init();
    this.sectionManager.init();
    this.dragDropManager.init();
    this.layoutManager.init();
    this.pdfManager.init();
    
    // Set up event listeners for main buttons
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Main toolbar buttons
    document.getElementById('add-experience').addEventListener('click', 
      () => this.sectionManager.addSection(SECTION_TYPES.EXPERIENCE));
    
    document.getElementById('add-education').addEventListener('click', 
      () => this.sectionManager.addSection(SECTION_TYPES.EDUCATION));
    
    document.getElementById('add-achievement').addEventListener('click', 
      () => this.sectionManager.addSection(SECTION_TYPES.ACHIEVEMENT));
    
    document.getElementById('add-skill').addEventListener('click', 
      () => this.sectionManager.addSection(SECTION_TYPES.SKILL));
    
    document.getElementById('add-project').addEventListener('click', 
      () => this.sectionManager.addSection(SECTION_TYPES.PROJECT));
    
    document.getElementById('add-custom-section').addEventListener('click', 
      () => this.sectionManager.addSection(SECTION_TYPES.CUSTOM));
    
    // Inline add buttons
    document.getElementById('add-experience-inline').addEventListener('click', 
      () => this.sectionManager.addSection(SECTION_TYPES.EXPERIENCE));
    
    document.getElementById('add-education-inline').addEventListener('click', 
      () => this.sectionManager.addSection(SECTION_TYPES.EDUCATION));
    
    document.getElementById('add-achievement-inline').addEventListener('click', 
      () => this.sectionManager.addSection(SECTION_TYPES.ACHIEVEMENT));
    
    document.getElementById('add-skill-inline').addEventListener('click', 
      () => this.sectionManager.addSection(SECTION_TYPES.SKILL));
    
    document.getElementById('add-project-inline').addEventListener('click', 
      () => this.sectionManager.addSection(SECTION_TYPES.PROJECT));
  }
}
