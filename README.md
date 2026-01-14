# AIZboostr - AI Powered Brand Building

Transform your business with AIZboostr's cutting-edge AI automation, marketing solutions, and exclusive AI Academy.

## Features

- 🤖 AI-powered automation and SaaS solutions
- 📚 AI Academy for learning and certification
- 🎥 Video ads and marketing services
- 🔐 Secure authentication with Firebase (Email/Password + Google)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Firebase Auth
- **State Management**: TanStack Query
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aizboostr-brand-brilliance.git
cd aizboostr-brand-brilliance
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Firebase config:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication → Sign-in methods:
   - Email/Password
   - Google
3. Add your web app and copy the config to `.env`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
