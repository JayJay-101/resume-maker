const puppeteer = require('puppeteer');

/**
 * Generates a PDF from HTML content using Puppeteer
 * 
 * @param {string} htmlContent - The HTML content to convert to PDF
 * @param {string} cssContent - The CSS content to be included in the PDF
 * @returns {Promise<Buffer>} The PDF as a buffer
 */
async function generatePDF(htmlContent, cssContent) {
  let browser = null;
  
  try {
    // Launch a headless browser
    browser = await puppeteer.launch({
      headless: 'new', // Use the new headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    // Create a new page
    const page = await browser.newPage();
    
    // Combine HTML and CSS
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>${cssContent}</style>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
    
    // Set the page content
    await page.setContent(fullHtml, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Generate PDF with A4 size
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  generatePDF
};
