const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pdfGenerator = require('./pdfGenerator');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// Serve the resume editor HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'resume.html'));
});

// Generate PDF from HTML content
app.post('/generate-pdf', async (req, res) => {
  try {
    const { html, cssContent, filename = 'resume.pdf' } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // Generate PDF using Puppeteer
    const pdfBuffer = await pdfGenerator.generatePDF(html, cssContent);
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    // Send the PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
