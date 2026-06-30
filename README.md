# Bitrix Dashboard App

A React dashboard for displaying Bitrix CRM contacts with responsible person and team information.

## Features

- **Contacts Dashboard**: View all Bitrix contacts with their assigned responsible person and team details
- **KPI Cards**: Display key metrics including total contacts, team distribution, unassigned contacts, and more
- **Interactive Charts**: Bar charts showing contacts by team and by responsible person
- **Filtering**: Filter contacts by team, responsible person, and search by name/email
- **Real-time Data**: Fetches live data from Bitrix CRM API
- **Caching**: Implements module-level caching for improved performance

## Tech Stack

- React 18
- React Router DOM
- Recharts (for data visualization)
- TailwindCSS (for styling)
- Lucide React (for icons)
- Vite (build tool)

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── PageHeader.jsx
│   ├── FilterBar.jsx
│   ├── KpiCard.jsx
│   ├── LoadingSpinner.jsx
│   └── ErrorMessage.jsx
├── hooks/              # Custom React hooks
│   ├── useBitrixUsers.js
│   └── useBitrixContacts.js
├── pages/              # Page components
│   └── ContactsDashboard.jsx
├── utils/              # Utility functions
│   ├── bitrix.js       # Bitrix API utilities
│   └── utils.js        # General utilities
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## API Configuration

The Bitrix API endpoint is configured in `src/utils/bitrix.js`:
- Base URL: `https://regaliscapitalcorp.bitrix24.com/rest/1/nk4lkwq9527dxv4n`
- Team Field: `UF_USR_1779466932710`

## Team Colors

- EA: Indigo (#6366f1)
- Lemon: Yellow (#f59e0b)
- Racquel: Green (#10b981)
- Rox: Red (#f43f5e)
- Unassigned: Gray (#9ca3af)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
