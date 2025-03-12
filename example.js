// Example usage of the PDF Generator
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const pdfGenerator = require('./pdfGenerator');

// Create a sample server to demonstrate PDF generation
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'resume.html'));
});

// Generate a PDF from a sample resume
app.get('/sample-pdf', async (req, res) => {
  try {
    // Read the sample HTML and CSS
    const htmlContent = fs.readFileSync(path.join(__dirname, 'public', 'resume.html'), 'utf8');
    const cssContent = fs.readFileSync(path.join(__dirname, 'public', 'styles.css'), 'utf8');
    
    // Generate PDF
    const pdfBuffer = await pdfGenerator.generatePDF(htmlContent, cssContent);
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=sample_resume.pdf');
    
    // Send the PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Example server running on http://localhost:${PORT}`);
  console.log(`Access http://localhost:${PORT}/sample-pdf to generate a sample PDF`);
});
