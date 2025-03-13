/**
 * Templates utility functions
 * Centralizes HTML template generation
 */

/**
 * Create an experience item template
 * @param {Object} data - Experience data
 * @returns {string} HTML template
 */
export function createExperienceTemplate(data = {}) {
  const {
    position = 'New Position',
    company = 'Company Name, Location',
    dates = 'Start Date - End Date',
    bullets = ['Enter your responsibilities and achievements here']
  } = data;
  
  const bulletItems = bullets.map(bullet => `<li contenteditable="true">${bullet}</li>`).join('');
  
  return `
    <div class="experience-item">
      <button class="delete-button">×</button>
      <div class="item-header">
        <span class="position" contenteditable="true">${position}</span>
        <span class="date" contenteditable="true">${dates}</span>
      </div>
      <div class="company" contenteditable="true">${company}</div>
      <ul class="description">
        ${bulletItems}
        <button class="add-list-item"><i class="fas fa-plus"></i> Add Bullet Point</button>
      </ul>
    </div>
  `;
}

/**
 * Create an education item template
 * @param {Object} data - Education data
 * @returns {string} HTML template
 */
export function createEducationTemplate(data = {}) {
  const {
    degree = 'Degree Name',
    school = 'School Name, Location',
    year = 'Graduation Year',
    details = ['GPA: 3.8/4.0', 'Relevant coursework: Course 1, Course 2']
  } = data;
  
  const detailItems = details.map(detail => `<p contenteditable="true">${detail}</p>`).join('');
  
  return `
    <div class="education-item">
      <button class="delete-button">×</button>
      <div class="item-header">
        <span class="degree" contenteditable="true">${degree}</span>
        <span class="date" contenteditable="true">${year}</span>
      </div>
      <div class="school" contenteditable="true">${school}</div>
      <div class="description">
        ${detailItems}
      </div>
    </div>
  `;
}

/**
 * Create a skill category template
 * @param {Object} data - Skill category data
 * @returns {string} HTML template
 */
export function createSkillCategoryTemplate(data = {}) {
  const {
    title = 'Skill Category',
    skills = ['Skill 1', 'Skill 2', 'Skill 3']
  } = data;
  
  const skillItems = skills.map(skill => 
    `<span class="skill-item" contenteditable="true">${skill}</span>`
  ).join('');
  
  return `
    <div class="skill-category">
      <button class="delete-button">×</button>
      <div class="skill-category-title" contenteditable="true">${title}</div>
      <div class="skills-list">
        ${skillItems}
      </div>
      <button class="add-skill-btn"><i class="fas fa-plus"></i> Add Skill</button>
    </div>
  `;
}

/**
 * Create a project item template
 * @param {Object} data - Project data
 * @returns {string} HTML template
 */
export function createProjectTemplate(data = {}) {
  const {
    name = 'Project Name',
    dates = 'Project Date',
    technologies = 'Technologies Used',
    bullets = ['Project description and achievements']
  } = data;
  
  const bulletItems = bullets.map(bullet => `<li contenteditable="true">${bullet}</li>`).join('');
  
  return `
    <div class="project-item">
      <button class="delete-button">×</button>
      <div class="item-header">
        <span class="project-name" contenteditable="true">${name}</span>
        <span class="date" contenteditable="true">${dates}</span>
      </div>
      <div class="project-tech" contenteditable="true">${technologies}</div>
      <ul class="description">
        ${bulletItems}
        <button class="add-list-item"><i class="fas fa-plus"></i> Add Bullet Point</button>
      </ul>
    </div>
  `;
}

/**
 * Create an achievement item template
 * @param {string} text - Achievement text
 * @returns {string} HTML template
 */
export function createAchievementTemplate(text = 'New achievement') {
  return `
    <div class="achievement-item">
      <button class="delete-button">×</button>
      <span contenteditable="true">${text}</span>
    </div>
  `;
}

/**
 * Create a custom item template
 * @param {Object} data - Custom item data
 * @returns {string} HTML template
 */
export function createCustomItemTemplate(data = {}) {
  const {
    title = 'Item Title',
    date = 'Date',
    bullets = ['Description point']
  } = data;
  
  const bulletItems = bullets.map(bullet => `<li contenteditable="true">${bullet}</li>`).join('');
  
  return `
    <div class="custom-item">
      <button class="delete-button">×</button>
      <div class="item-header">
        <span class="custom-item-title" contenteditable="true">${title}</span>
        <span class="date" contenteditable="true">${date}</span>
      </div>
      <div class="description">
        <ul class="description">
          ${bulletItems}
          <button class="add-list-item"><i class="fas fa-plus"></i> Add Bullet Point</button>
        </ul>
      </div>
    </div>
  `;
}
