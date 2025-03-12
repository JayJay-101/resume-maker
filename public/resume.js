/**
 * Enhanced Resume Maker
 * OOP implementation with drag-and-drop section arrangement
 */

// Main application class
class ResumeEditor {
    constructor() {
        this.sectionManager = new SectionManager();
        this.dragDropManager = new DragDropManager(this.sectionManager);
        this.contentEditable = new ContentEditableManager();
        this.layoutArrangement = new LayoutArrangementManager(this.sectionManager);
        this.pdfManager = new PdfGenerator(); // Add PDF manager

        // Initialize components
        this.init();
    }
    
    init() {
        // Initialize all managers
        this.contentEditable.init();
        this.sectionManager.init();
        this.dragDropManager.init();
        this.layoutArrangement.init();
        this.pdfManager.init(); // Initialize PDF manager

        // Set up event listeners for main buttons
        document.getElementById('add-experience').addEventListener('click', () => this.sectionManager.addExperience());
        document.getElementById('add-education').addEventListener('click', () => this.sectionManager.addEducation());
        document.getElementById('add-achievement').addEventListener('click', () => this.sectionManager.addAchievement());
        document.getElementById('add-skill').addEventListener('click', () => this.sectionManager.addSkillCategory());
        document.getElementById('add-project').addEventListener('click', () => this.sectionManager.addProject());
        document.getElementById('add-custom-section').addEventListener('click', () => this.sectionManager.addCustomSection());
        
        // Set up inline add buttons
        document.getElementById('add-experience-inline').addEventListener('click', () => this.sectionManager.addExperience());
        document.getElementById('add-education-inline').addEventListener('click', () => this.sectionManager.addEducation());
        document.getElementById('add-achievement-inline').addEventListener('click', () => this.sectionManager.addAchievement());
        document.getElementById('add-skill-inline').addEventListener('click', () => this.sectionManager.addSkillCategory());
        document.getElementById('add-project-inline').addEventListener('click', () => this.sectionManager.addProject());
    }
}

// PdfGenerator class - handles PDF generation using server-side Puppeteer
class PdfGenerator {
    constructor() {}
    
    init() {
        // Add event listener for the download PDF button
        document.getElementById('download-pdf').addEventListener('click', () => this.generatePDF());
    }
    
    async generatePDF() {
        try {
            // Show loading indicator
            this.showLoading(true);
            
            // Get the resume content
            const resumeContainer = document.querySelector('.resume-container');
            
            // Make a copy of the container to remove editor controls
            const tempContainer = resumeContainer.cloneNode(true);
            
            // Remove editor controls from the copy
            this.cleanupForPrint(tempContainer);
            
            // Get HTML content
            const htmlContent = tempContainer.outerHTML;
            
            // Get CSS content
            const cssContent = await this.getCSSContent();
            
            // Send to server
            const response = await fetch('/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    html: htmlContent,
                    cssContent: cssContent,
                    filename: 'my_resume.pdf'
                }),
            });
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            // Get the PDF blob
            const pdfBlob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'my_resume.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            // Hide loading indicator
            this.showLoading(false);
        }
    }
    
    cleanupForPrint(container) {
        // Remove all editor controls
        container.querySelectorAll('.editor-controls, .add-button, .delete-button, .add-skill-btn, .add-list-item, .arrangement-overlay').forEach(el => {
            el.remove();
        });
        
        // Remove edit attributes and classes
        container.querySelectorAll('[contenteditable="true"]').forEach(el => {
            el.removeAttribute('contenteditable');
        });
    }
    
    async getCSSContent() {
        // Get all stylesheets
        const styleSheets = Array.from(document.styleSheets);
        let cssContent = '';
        
        for (const sheet of styleSheets) {
            // Skip external stylesheets
            if (sheet.href && !sheet.href.startsWith(window.location.origin)) continue;
            
            try {
                const rules = Array.from(sheet.cssRules || sheet.rules);
                for (const rule of rules) {
                    cssContent += rule.cssText + '\n';
                }
            } catch (e) {
                // Cross-origin stylesheet access error
                console.warn('Could not access stylesheet rules', e);
            }
        }
        
        // Add custom print styles
        cssContent += `
        @media print {
            body { margin: 0; padding: 0; }
            .resume-container { box-shadow: none; }
        }`;
        
        return cssContent;
    }
    
    showLoading(show) {
        // Create loading element if it doesn't exist
        let loadingEl = document.getElementById('pdf-loading');
        
        if (!loadingEl && show) {
            loadingEl = document.createElement('div');
            loadingEl.id = 'pdf-loading';
            loadingEl.innerHTML = `
                <div class="loading-overlay">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Generating PDF...</div>
                </div>
            `;
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }
                .loading-spinner {
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #2563eb;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                }
                .loading-text {
                    color: white;
                    font-size: 18px;
                    font-family: 'Roboto', sans-serif;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(loadingEl);
        } else if (loadingEl && !show) {
            loadingEl.remove();
        }
    }
}

// ContentEditableManager class - handles content editable behavior
class ContentEditableManager {
    constructor() {}
    
    init() {
        this.setupContactLinkUpdates();
    }
    
    setupContactLinkUpdates() {
        document.querySelectorAll('.contact-info a.contact-item').forEach(link => {
            link.addEventListener('input', function() {
                const text = this.textContent.trim();
                const icon = this.querySelector('i');
                
                if (icon.classList.contains('fa-envelope')) {
                    this.setAttribute('href', `mailto:${text.replace(/ /g, '')}`);
                } else if (icon.classList.contains('fa-phone')) {
                    const digits = text.replace(/\D/g, '');
                    this.setAttribute('href', `tel:+1${digits}`);
                } else if (icon.classList.contains('fa-map-marker-alt')) {
                    this.setAttribute('href', `https://maps.google.com/?q=${encodeURIComponent(text)}`);
                } else if (icon.classList.contains('fa-linkedin')) {
                    const username = text.includes('/') ? text.split('/').pop() : text;
                    this.setAttribute('href', `https://linkedin.com/in/${username.trim()}`);
                } else if (icon.classList.contains('fa-github')) {
                    const username = text.includes('/') ? text.split('/').pop() : text;
                    this.setAttribute('href', `https://github.com/${username.trim()}`);
                }
            });
        });
    }
}

// SectionManager class - handles adding, removing, and managing resume sections
class SectionManager {
    constructor() {
        this.refreshContainers();
        
        // Store templates
        this.templates = {};
    }
    
    // NEW METHOD: Refresh container references after DOM changes
    refreshContainers() {
        // Store references to section containers
        this.containers = {
            experience: document.getElementById('experience-container'),
            education: document.getElementById('education-container'),
            achievement: document.getElementById('achievement-container'),
            skill: document.getElementById('skill-container'),
            project: document.getElementById('project-container'),
            customSections: document.getElementById('custom-sections-container')
        };
    }
    
    init() {
        // Store the templates for each section type
        this.templates.experience = document.querySelector('.experience-item');
        this.templates.education = document.querySelector('.education-item');
        this.templates.achievement = document.querySelector('.achievement-item');
        this.templates.skillCategory = document.querySelector('.skill-category');
        this.templates.project = document.querySelector('.project-item');
        
        // Initialize delete buttons
        document.querySelectorAll('.delete-button').forEach(button => this.setupDeleteButton(button));
        
        // Initialize add skill buttons
        document.querySelectorAll('.skill-category').forEach(category => this.setupAddSkillButton(category));
        
        // Initialize add list item buttons
        this.setupAddListItemButtons();
    }
    
    // Get all major section elements
    getAllSections() {
        return document.querySelectorAll('.section');
    }
    
    // Add new section methods
    addExperience() {
        const clone = this.cloneTemplate(this.templates.experience);
        this.setupDeleteButton(clone);
        this.resetEditableContent(clone);
        
        const addListItemBtn = clone.querySelector('.add-list-item');
        if (addListItemBtn) {
            addListItemBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addListItem(addListItemBtn.parentNode);
            });
        }
        
        this.containers.experience.appendChild(clone);
    }
    
    addEducation() {
        const clone = this.cloneTemplate(this.templates.education);
        this.setupDeleteButton(clone);
        this.resetEditableContent(clone);
        this.containers.education.appendChild(clone);
    }
    
    addAchievement() {
        const clone = this.cloneTemplate(this.templates.achievement);
        this.setupDeleteButton(clone);
        this.resetEditableContent(clone);
        this.containers.achievement.appendChild(clone);
    }
    
    addSkillCategory() {
        const clone = this.cloneTemplate(this.templates.skillCategory);
        this.setupDeleteButton(clone);
        this.resetEditableContent(clone);
        this.setupAddSkillButton(clone);
        this.containers.skill.appendChild(clone);
    }
    
    addProject() {
        const clone = this.cloneTemplate(this.templates.project);
        this.setupDeleteButton(clone);
        this.resetEditableContent(clone);
        
        const addListItemBtn = clone.querySelector('.add-list-item');
        if (addListItemBtn) {
            addListItemBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addListItem(addListItemBtn.parentNode);
            });
        }
        
        this.containers.project.appendChild(clone);
    }
    
    addCustomSection() {
        // Refresh container references to ensure we have the latest DOM structure
        this.refreshContainers();
        
        // Create the custom section element
        const section = document.createElement('div');
        section.className = 'section custom-section';
        section.setAttribute('data-section-type', 'custom');
        
        // Add delete button for the entire section
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button';
        deleteBtn.innerHTML = '×';
        deleteBtn.addEventListener('click', () => section.remove());
        section.appendChild(deleteBtn);
        
        // Add section title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.contentEditable = 'true';
        title.textContent = 'Custom Section';
        section.appendChild(title);
        
        // Add section content container
        const content = document.createElement('div');
        content.className = 'section-content';
        content.id = `custom-container-${Date.now()}`; // Unique ID
        section.appendChild(content);
        
        // Add a default item
        const item = this.createCustomItem();
        content.appendChild(item);
        
        // Add button to add more items
        const addButton = document.createElement('div');
        addButton.className = 'add-button';
        addButton.innerHTML = '<i class="fas fa-plus"></i> Add Item';
        addButton.addEventListener('click', () => {
            const newItem = this.createCustomItem();
            content.appendChild(newItem);
        });
        section.appendChild(addButton);
        
        // Check if customSections container exists and add the section
        if (this.containers.customSections) {
            this.containers.customSections.appendChild(section);
        } else {
            console.error('Custom sections container not found.');
            // Try to find or create the container as a fallback
            let customSectionsContainer = document.getElementById('custom-sections-container');
            if (!customSectionsContainer) {
                customSectionsContainer = document.createElement('div');
                customSectionsContainer.id = 'custom-sections-container';
                document.getElementById('right-column').appendChild(customSectionsContainer);
                this.containers.customSections = customSectionsContainer;
            }
            customSectionsContainer.appendChild(section);
        }
    }
    
    // Helper methods
    cloneTemplate(template) {
        return template.cloneNode(true);
    }
    
    setupDeleteButton(element) {
        const deleteBtn = element.querySelector('.delete-button');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => element.remove());
        }
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
        // Insert before the button
        list.insertBefore(newItem, list.querySelector('.add-list-item'));
    }
    
    setupAddSkillButton(element) {
        const addSkillBtn = element.querySelector('.add-skill-btn');
        const skillsList = element.querySelector('.skills-list');
        
        if (addSkillBtn && skillsList) {
            addSkillBtn.addEventListener('click', () => this.addSkill(skillsList));
        }
    }
    
    addSkill(skillsList) {
        const newSkill = document.createElement('span');
        newSkill.className = 'skill-item';
        newSkill.contentEditable = 'true';
        newSkill.textContent = 'New Skill';
        skillsList.appendChild(newSkill);
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
    
    createCustomItem() {
        const item = document.createElement('div');
        item.className = 'custom-item';
        
        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button';
        deleteBtn.innerHTML = '×';
        deleteBtn.addEventListener('click', () => item.remove());
        item.appendChild(deleteBtn);
        
        // Add header with title and date
        const header = document.createElement('div');
        header.className = 'item-header';
        
        const title = document.createElement('span');
        title.className = 'custom-item-title';
        title.contentEditable = 'true';
        title.textContent = 'Item Title';
        header.appendChild(title);
        
        const date = document.createElement('span');
        date.className = 'date';
        date.contentEditable = 'true';
        date.textContent = 'Date';
        header.appendChild(date);
        
        item.appendChild(header);
        
        // Add description with bullet points
        const description = document.createElement('div');
        description.className = 'description';
        
        const list = document.createElement('ul');
        list.className = 'description';
        
        const listItem = document.createElement('li');
        listItem.contentEditable = 'true';
        listItem.textContent = 'Enter a description point here';
        list.appendChild(listItem);
        
        // Add button to add more list items
        const addListItemBtn = document.createElement('button');
        addListItemBtn.className = 'add-list-item';
        addListItemBtn.innerHTML = '<i class="fas fa-plus"></i> Add Bullet Point';
        addListItemBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.addListItem(list);
        });
        list.appendChild(addListItemBtn);
        
        description.appendChild(list);
        item.appendChild(description);
        
        return item;
    }
}

// DragDropManager class - handles drag and drop functionality
class DragDropManager {
    constructor(sectionManager) {
        this.sectionManager = sectionManager;
        this.draggedElement = null;
    }
    
    init() {
        // This class just maintains the drag & drop logic
        // Actual implementation is in the LayoutArrangementManager
    }
}

// LayoutArrangementManager class - handles section arrangement UI and logic
class LayoutArrangementManager {
    constructor(sectionManager) {
        this.sectionManager = sectionManager;
        this.isArranging = false;
        this.draggedSection = null;
        
        // Get DOM elements
        this.overlay = document.getElementById('arrangement-overlay');
        this.leftColumnArrange = document.getElementById('left-column-arrange');
        this.rightColumnArrange = document.getElementById('right-column-arrange');
        this.leftColumnSlots = this.leftColumnArrange.querySelector('.arrangement-slots');
        this.rightColumnSlots = this.rightColumnArrange.querySelector('.arrangement-slots');
        
        // Get columns
        this.leftColumn = document.getElementById('left-column');
        this.rightColumn = document.getElementById('right-column');
    }
    
    init() {
        // Add arrangement toggle button listener
        document.getElementById('toggle-arrangement').addEventListener('click', () => this.toggleArrangementMode());
        
        // Add save and cancel button listeners
        document.getElementById('save-arrangement').addEventListener('click', () => this.saveArrangement());
        document.getElementById('cancel-arrangement').addEventListener('click', () => this.cancelArrangement());
    }
    
    toggleArrangementMode() {
        this.isArranging = !this.isArranging;
        
        if (this.isArranging) {
            // Show the arrangement overlay
            this.overlay.style.display = 'flex';
            
            // Load current sections into the arrangement UI
            this.populateArrangementUI();
            
            // Set up drag and drop for arrangement sections
            this.setupArrangementDragDrop();
        } else {
            // Hide the arrangement overlay
            this.overlay.style.display = 'none';
        }
    }
    
    populateArrangementUI() {
        // Clear current slots
        this.leftColumnSlots.innerHTML = '';
        this.rightColumnSlots.innerHTML = '';
        
        // Add sections from left column
        Array.from(this.leftColumn.querySelectorAll('.section')).forEach(section => {
            const sectionTitle = section.querySelector('.section-title').textContent;
            const sectionType = section.getAttribute('data-section-type');
            // If section has no ID, assign one based on type for consistent reference
            if (!section.id) {
                section.id = `${sectionType}-section-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            }
            this.addSectionToArrangementUI(sectionTitle, sectionType, this.leftColumnSlots, section.id);
        });
        
        // Add sections from right column
        Array.from(this.rightColumn.querySelectorAll('.section')).forEach(section => {
            const sectionTitle = section.querySelector('.section-title').textContent;
            const sectionType = section.getAttribute('data-section-type');
            // If section has no ID, assign one based on type for consistent reference
            if (!section.id) {
                section.id = `${sectionType}-section-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            }
            this.addSectionToArrangementUI(sectionTitle, sectionType, this.rightColumnSlots, section.id);
        });
    }
    
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
    
    saveArrangement() {
        // Get the new arrangement
        const leftColumnSections = Array.from(this.leftColumnSlots.querySelectorAll('.arrangement-section'));
        const rightColumnSections = Array.from(this.rightColumnSlots.querySelectorAll('.arrangement-section'));
        
        // First, collect all existing sections from both columns before clearing them
        const allSections = {};
        
        // Collect left column sections
        Array.from(this.leftColumn.querySelectorAll('.section')).forEach(section => {
            const sectionType = section.getAttribute('data-section-type');
            const sectionId = section.id;
            allSections[sectionId || sectionType] = section;
        });
        
        // Collect right column sections
        Array.from(this.rightColumn.querySelectorAll('.section')).forEach(section => {
            const sectionType = section.getAttribute('data-section-type');
            const sectionId = section.id;
            allSections[sectionId || sectionType] = section;
        });
        
        // Now it's safe to clear the columns because we have references to all sections
        this.leftColumn.innerHTML = '';
        this.rightColumn.innerHTML = '';
        
        // Move sections to their new positions in left column
        leftColumnSections.forEach(arrangementSection => {
            const sectionType = arrangementSection.getAttribute('data-section-type');
            const sectionId = arrangementSection.getAttribute('data-section-id');
            const key = sectionId || sectionType;
            
            if (allSections[key]) {
                this.leftColumn.appendChild(allSections[key]);
            }
        });
        
        // Move sections to their new positions in right column
        rightColumnSections.forEach(arrangementSection => {
            const sectionType = arrangementSection.getAttribute('data-section-type');
            const sectionId = arrangementSection.getAttribute('data-section-id');
            const key = sectionId || sectionType;
            
            if (allSections[key]) {
                this.rightColumn.appendChild(allSections[key]);
            }
        });
        
        // Create custom-sections-container in right column if it doesn't exist anymore
        if (!document.getElementById('custom-sections-container')) {
            const customSectionsContainer = document.createElement('div');
            customSectionsContainer.id = 'custom-sections-container';
            this.rightColumn.appendChild(customSectionsContainer);
        }
        
        // Refresh container references in SectionManager after rearrangement
        this.sectionManager.refreshContainers();
        
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
        
        document.querySelectorAll('.skill-category').forEach(category => {
            this.sectionManager.setupAddSkillButton(category);
        });
        
        // Exit arrangement mode
        this.toggleArrangementMode();
    }
    
    findSectionByType(type) {
        return document.querySelector(`.section[data-section-type="${type}"]`);
    }
    
    cancelArrangement() {
        // Just exit arrangement mode without saving
        this.toggleArrangementMode();
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const resumeEditor = new ResumeEditor();
});