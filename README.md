# Resume PDF Generator
[buymecofee!](https://buymeacoffee.com/jaybuddyjay)
A Node.js application that allows you to create, edit, and export professional resumes as PDF documents using a drag-and-drop interface.

## Features

- Interactive resume editor with drag-and-drop sections
- Dynamic content editing with real-time preview
- Export to high-quality PDF using Puppeteer
- Responsive layout with customizable sections
- Add/remove experiences, education, skills, projects, and custom sections
- Rearrange layout and organization of content
- Professional typography and design

## Requirements

- Node.js (v18.0.0 or later)
- npm or yarn package manager

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Usage

### Start the application

```bash
npm start
```

This will start the server at http://localhost:3000

### Development mode

```bash
npm run dev
```

This will start the server with nodemon for automatic restarts during development.

## How to Use the Resume Editor

1. Open your browser and go to http://localhost:3000
2. Edit your resume by clicking on any text field
3. Use the buttons in the top-right corner to add new sections
4. Drag and drop sections to rearrange them using the "Arrange Layout" button
5. Click "Download PDF" to export your resume as a PDF document

## Project Structure

- `server.js` - Express server setup
- `pdfGenerator.js` - PDF generation logic using Puppeteer
- `public/` - Client-side files
  - `resume.html` - Main HTML template
  - `resume.js` - Interactive editor functionality
  - `styles.css` - Styling for the resume
- `example.js` - Example usage of the PDF generator

## Technologies Used

- Express.js - Web server
- Puppeteer - Headless Chrome for PDF generation
- JavaScript/HTML/CSS - Front-end editor

## License

MIT
