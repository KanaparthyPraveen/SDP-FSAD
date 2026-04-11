# PlaceIQ – College Placement Management System (Frontend)

PlaceIQ is a modern web application designed to streamline the placement process in educational institutions. It provides a seamless interface for students to discover opportunities and for administrators to manage the placement lifecycle.

## 🔗 Repository Links
- **Frontend Repo**: [SDP-FSAD](https://github.com/KanaparthyPraveen/SDP-FSAD) (You are here)
- **Backend Repo**: [SDP-FSAD-BACKEND](https://github.com/KanaparthyPraveen/SDP-FSAD-BACKEND)

## 🚀 Tech Stack
- **Framework**: Vite + React.js
- **Styling**: Tailwind CSS
- **State Management**: React Context / Hooks
- **Icons**: Lucide React
- **Build Tool**: Vite
- **API Communication**: Axios (to Spring Boot Backend)

## 🛠️ Key Features
- **Student Dashboard**: View job postings, apply for placements, and track status.
- **Admin Dashboard**: Manage companies, student applications, and placement statistics.
- **Real-time Notifications**: Toast notifications for user actions.
- **Profile Management**: Professional student profiles with CGPA and skill tracking.
- **Responsive Design**: Fully responsive UI for mobile and desktop.

## 📂 Project Structure
```plaintext
src/
├── api/            # API service calls
├── components/     # Reusable UI components
├── context/        # Global state (Auth, UI)
├── hooks/          # Custom react hooks
├── pages/          # Full page components (Admin, Student, Auth)
├── styles/         # Global styles
└── utility/        # Helper functions
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/KanaparthyPraveen/SDP-FSAD.git
   ```
2. Navigate to the project directory:
   ```bash
   cd SDP-FSAD
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Backend Setup
This frontend requires the PlaceIQ Backend to be running. Follow the instructions in the [Backend Repository](https://github.com/KanaparthyPraveen/SDP-FSAD-BACKEND).
