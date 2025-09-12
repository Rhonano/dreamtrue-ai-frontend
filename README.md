# DreamTrue AI Frontend

A modern React-based frontend for the DreamTrue AI market analysis and strategy playbook application.

## Features

- **User Authentication**: Admin-managed user accounts with secure login
- **Company Analysis Form**: Submit company data for AI-powered market analysis
- **Loading Animation**: Engaging 2-3 minute loading experience with rotating messages
- **Strategy Playbook**: View HTML reports with embedded SVGs
- **PDF Export**: Download reports as PDF files
- **AI Chat Interface**: Chat with the LLM responsible for report generation
- **Share Functionality**: Share reports with team members
- **Modern UI/UX**: Clean, professional design with Tailwind CSS

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Context** for state management
- **Lucide React** for icons
- **jsPDF** for PDF generation
- **html2canvas** for HTML to PDF conversion

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Demo Credentials

- Email: `demo@dreamtrue.ai`
- Password: `demo123`

## Project Structure

```
src/
├── components/          # React components
│   ├── CompanyForm.tsx  # Company analysis form
│   ├── Header.tsx       # Application header
│   ├── LoadingAnimation.tsx # Loading animation with messages
│   ├── LoginForm.tsx    # User authentication
│   └── ReportViewer.tsx # Report display and chat interface
├── context/             # React Context for state management
│   └── AppContext.tsx   # Global application state
├── types/               # TypeScript type definitions
│   └── index.ts         # Application types
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
└── index.css            # Global styles with Tailwind
```

## Key Components

### CompanyForm
- Handles company data submission
- Validates required fields (company name)
- Submits to backend webhook
- Manages form state and error handling

### LoadingAnimation
- Displays during 2-3 minute analysis period
- Rotates through engaging messages
- Shows progress indicators
- Includes fun facts and tips

### ReportViewer
- Displays completed HTML reports
- Tabbed interface for playbook and chat
- PDF download functionality
- Share with team members feature

## Backend Integration

The application is designed to integrate with your existing backend via webhooks:

1. **Form Submission**: POST company data to your backend endpoint
2. **Status Polling**: Check report generation status
3. **Report Retrieval**: Fetch completed HTML reports
4. **Chat Integration**: Connect to your LLM chat API

## Deployment

The application is configured for deployment on Google Cloud Platform (Cloud Run):

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Cloud Run using the generated `build/` folder

## Customization

### Branding
- Update colors in `tailwind.config.js`
- Modify logo and branding in components
- Customize loading messages in `LoadingAnimation.tsx`

### API Integration
- Update API endpoints in form submission handlers
- Configure webhook URLs for backend communication
- Implement actual authentication with your backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to DreamTrue AI.
