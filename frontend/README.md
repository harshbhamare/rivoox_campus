# Teacher's Dashboard - React Vite Project

A comprehensive Teacher's Dashboard built with React and Vite, featuring a complete student management system with blue-themed UI design.

## Features

### 🎯 Main Dashboard
- Overall class analysis with progress circles
- Student submission tracking
- Category and batch-wise filtering
- Student performance table

### 👥 Manage Class
- **Import Students Data**: Bulk upload via Excel sheets
- **Batch Allocation**: Organize students into batches (C1, C2, C3, C4)
- **Faculty Subject Allotment**: Add theory and practical subjects
- **Edit Student Profile**: Complete student information management

### 📊 Your Submissions
- Track submission progress with visual indicators
- Subject-wise submission status
- Progress tracking with percentage completion

### 🔍 Subject Wise Analysis (Search Student)
- Student search functionality
- QR code integration for quick profile access
- Mark assignments for TA, CIE, and Defaulter Work
- Subject filtering

### ⚠️ Defaulter Plug
- Manage defaulter work assignments
- Add and edit work content
- Subject-specific defaulter work management

## Tech Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: Pure CSS with responsive design

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd teacher-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
teacher-dashboard/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx & .css
│   │   ├── Header.jsx & .css
│   │   ├── Dashboard.jsx & .css
│   │   ├── ManageClass.jsx & .css
│   │   ├── YourSubmissions.jsx & .css
│   │   ├── SubjectWiseAnalysis.jsx & .css
│   │   └── DefaulterPlug.jsx & .css
│   ├── App.jsx & .css
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── vite.config.js
```

## Key Features Implementation

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized layouts
- Flexible grid systems

### 🎨 UI Components
- Progress circles with animated fills
- Interactive buttons and forms
- Snackbar notifications
- Modal-like overlays

### 🔄 State Management
- React hooks for local state
- Component-level state management
- Form handling and validation

### 📋 Workflow Implementation
1. **Student Import**: Upload Excel → Batch Allocation → Success
2. **Subject Management**: Add Theory/Practical subjects with faculty assignment
3. **Student Profile**: Search and edit student information
4. **Progress Tracking**: Visual progress indicators and status updates

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.