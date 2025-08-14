# Resume Builder Application

A comprehensive web application for creating, managing, and downloading professional resumes. Built with React frontend and Node.js backend with SQLite database.

## Features

- **Comprehensive Resume Form**: Create resumes with personal information, skills, education, projects, certificates, and hobbies
- **Dynamic Lists**: Add multiple entries for skills, education, projects, certificates, and hobbies
- **Database Storage**: All resume data is stored in SQLite database with unique IDs
- **Resume Management**: View, edit, and delete saved resumes
- **PDF Generation**: Download resumes as professionally formatted PDF files
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Validation**: Form validation and error handling

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **PDFKit** - PDF generation
- **UUID** - Unique ID generation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **React Icons** - Icon library
- **CSS3** - Styling with modern features

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Install backend dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Production Build

1. Build the React app:
```bash
cd client
npm run build
```

2. Start the production server:
```bash
npm start
```

## Database Schema

The application uses SQLite with the following tables:

### resumes
- `id` (TEXT, PRIMARY KEY) - Unique identifier
- `name` (TEXT) - Full name
- `phone` (TEXT) - Phone number
- `email` (TEXT) - Email address
- `linkedin` (TEXT) - LinkedIn profile URL
- `created_at` (DATETIME) - Creation timestamp

### skills
- `id` (INTEGER, PRIMARY KEY)
- `resume_id` (TEXT, FOREIGN KEY)
- `skill` (TEXT) - Skill name

### education
- `id` (INTEGER, PRIMARY KEY)
- `resume_id` (TEXT, FOREIGN KEY)
- `institution` (TEXT) - School/University name
- `degree` (TEXT) - Degree type
- `field` (TEXT) - Field of study
- `start_date` (TEXT) - Start date
- `end_date` (TEXT) - End date
- `gpa` (TEXT) - Grade point average

### projects
- `id` (INTEGER, PRIMARY KEY)
- `resume_id` (TEXT, FOREIGN KEY)
- `title` (TEXT) - Project title
- `description` (TEXT) - Project description
- `technologies` (TEXT) - Technologies used
- `link` (TEXT) - Project link

### certificates
- `id` (INTEGER, PRIMARY KEY)
- `resume_id` (TEXT, FOREIGN KEY)
- `name` (TEXT) - Certificate name
- `issuer` (TEXT) - Issuing organization
- `date` (TEXT) - Date earned
- `link` (TEXT) - Verification link

### hobbies
- `id` (INTEGER, PRIMARY KEY)
- `resume_id` (TEXT, FOREIGN KEY)
- `hobby` (TEXT) - Hobby name

## API Endpoints

### Resumes
- `POST /api/resumes` - Create a new resume
- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get a specific resume
- `DELETE /api/resumes/:id` - Delete a resume
- `GET /api/resumes/:id/pdf` - Download resume as PDF

## Usage

1. **Create Resume**: Fill out the comprehensive form with your information
2. **Add Multiple Items**: Use the "+" buttons to add multiple skills, education entries, projects, etc.
3. **Save Resume**: Click "Save Resume" to store your data in the database
4. **View Resumes**: Switch to the "View Resumes" tab to see all saved resumes
5. **Download PDF**: Click the download button to get a professionally formatted PDF
6. **Manage Resumes**: View details, download, or delete resumes as needed

## Features in Detail

### Form Sections
- **Personal Information**: Name, phone, email, LinkedIn
- **Skills**: Add multiple skills with easy removal
- **Education**: Multiple education entries with institution, degree, dates, GPA
- **Projects**: Project details with title, description, technologies, and links
- **Certificates**: Professional certifications with issuer and verification links
- **Hobbies**: Personal interests and hobbies

### Resume Management
- **List View**: Grid layout showing all resumes with key information
- **Detail Modal**: Full resume preview with all sections
- **PDF Download**: Professional PDF generation with proper formatting
- **Delete Functionality**: Remove resumes with confirmation

### UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Styling**: Gradient backgrounds, smooth animations, hover effects
- **Form Validation**: Real-time validation and error messages
- **Loading States**: Visual feedback during operations
- **Success/Error Messages**: Clear feedback for user actions

## File Structure

```
resume-form-app/
├── server.js              # Main server file
├── package.json           # Backend dependencies
├── resumes.db            # SQLite database (created automatically)
├── client/               # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ResumeForm.js
│   │   │   ├── ResumeForm.css
│   │   │   ├── ResumeList.js
│   │   │   └── ResumeList.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json      # Frontend dependencies
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 