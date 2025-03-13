/**
 * PDFManager.js
 * Handles PDF generation using server-side Puppeteer
 */
export class PDFManager {
  constructor() {}
  
  /**
   * Initialize the PDF manager
   */
  init() {
    // Add event listener for the download PDF button
    document.getElementById('download-pdf').addEventListener('click', () => this.generatePDF());
  }
  
  /**
   * Generate a PDF of the resume
   */
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
  
  /**
   * Clean up the container for printing
   * @param {HTMLElement} container - The container to clean up
   */
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
  
  /**
   * Get the CSS content for the PDF
   * @returns {Promise<string>} The CSS content
   */
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
  
  /**
   * Show or hide the loading indicator
   * @param {boolean} show - Whether to show the loading indicator
   */
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
