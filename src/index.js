/**
 * Resume Maker - Main Entry Point
 */
import { ResumeEditor } from './components/ResumeEditor';
import './styles/main.css';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create a new instance of the ResumeEditor
  const resumeEditor = new ResumeEditor();
  
  // Make available globally for debugging if needed
  window.resumeEditor = resumeEditor;
});
