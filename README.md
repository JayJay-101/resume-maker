[buymecofee!](https://buymeacoffee.com/jaybuddyjay)
# Resume PDF Generator

A modular Node.js application that allows you to create, edit, and export professional resumes as PDF documents using a drag-and-drop interface. This project uses a component-based architecture for better maintainability and extensibility.

## Features

- Interactive resume editor with drag-and-drop sections
- Dynamic content editing with real-time preview
- Export to high-quality PDF using Puppeteer
- Responsive layout with customizable sections
- Add/remove experiences, education, skills, projects, and custom sections
- Rearrange layout and organization of content
- Professional typography and design
- Smart skill tags with comma-separation and backspace deletion
- Modular architecture for easy enhancement and maintenance

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

### Build the application

```bash
npm run build
```

This will bundle the JavaScript modules into a single file using webpack.

### Start the application

```bash
npm start
```

This will start the server at http://localhost:3000

### Development mode

```bash
npm run dev
```

This will start webpack in watch mode and the server with nodemon for automatic rebuilds and restarts during development.

## How to Use the Resume Editor

1. Open your browser and go to http://localhost:3000
2. Edit your resume by clicking on any text field
3. Use the buttons in the top-right corner to add new sections
4. Drag and drop sections to rearrange them using the "Arrange Layout" button
5. Working with skill tags:
   - Type text and press comma (,) to create a new skill tag
   - Empty a skill tag and press backspace to delete it
   - Paste comma-separated values to create multiple skill tags at once
6. Click "Download PDF" to export your resume as a PDF document

## Project Structure

```
resume-pdf-generator/
├── public/                # Static files
│   ├── resume.html        # Main HTML template
│   └── styles.css         # CSS styling
├── src/                   # Source code
│   ├── components/        # UI components
│   │   ├── sections/      # Resume section components
│   │   │   ├── BaseSection.js     # Base class for all sections
│   │   │   ├── Experience.js      # Experience section
│   │   │   ├── Education.js       # Education section
│   │   │   ├── Skills.js          # Skills section
│   │   │   ├── Projects.js        # Projects section
│   │   │   ├── Achievements.js    # Achievements section
│   │   │   └── Custom.js          # Custom sections
│   │   └── ResumeEditor.js        # Main editor component
│   ├── constants/         # Application constants
│   │   └── sectionTypes.js        # Section type definitions
│   ├── managers/          # Feature managers
│   │   ├── ContentManager.js      # Content editing functionality
│   │   ├── DragDropManager.js     # Drag and drop functionality
│   │   ├── LayoutManager.js       # Layout arrangement manager
│   │   ├── PDFManager.js          # PDF generation manager
│   │   └── SectionManager.js      # Section management
│   ├── utils/             # Utility functions
│   │   ├── dom.js                 # DOM manipulation helpers
│   │   ├── events.js              # Event handling utilities
│   │   └── templates.js           # HTML templates
│   ├── styles/            # Component-specific styles
│   │   └── main.css               # Main stylesheet
│   └── index.js           # Application entry point
├── pdfGenerator.js        # Server-side PDF generation with Puppeteer
├── server.js              # Express server
├── webpack.config.js      # Webpack configuration
└── package.json           # Project configuration
```

## Architecture

This project uses a modular component-based architecture to improve maintainability and extensibility:

- **Components**: Encapsulate UI elements and their behavior
- **Managers**: Handle specific features like content editing, PDF generation, etc.
- **Utils**: Provide reusable utility functions
- **Constants**: Store application-wide constants

### Key Components:

- **ResumeEditor**: Main application component that initializes and coordinates all other components
- **Section Components**: Individual section types with specific behaviors
- **SectionManager**: Handles the creation, deletion, and management of sections
- **LayoutManager**: Manages the arrangement and positioning of sections
- **PDFManager**: Handles PDF generation and downloading

## Technologies Used

- **Express.js**: Web server
- **Webpack**: Module bundling
- **Babel**: JavaScript transpiling
- **Puppeteer**: Headless Chrome for PDF generation
- **JavaScript/HTML/CSS**: Front-end implementation

## Extending the Application

To add a new feature or section type:

1. Create a new component in the appropriate directory
2. Import and register it in the related manager
3. Add any necessary utility functions or constants
4. Update the HTML template if needed
5. Rebuild the application

## License

MIT