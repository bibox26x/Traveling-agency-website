# Travel Agency Frontend

A modern, responsive travel agency website built with Next.js and TypeScript. The application supports multiple languages (English, French, and Arabic) with RTL support.

## Features

- 🌍 Internationalization (i18n) with support for:
  - English
  - French
  - Arabic (with RTL layout)
- 🎨 Modern UI with Tailwind CSS
- 🔒 Secure authentication system
- 📱 Fully responsive design
- 🛄 Trip booking system
- 💳 Payment integration
- 👤 User profile management
- 📅 Booking management

## Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Internationalization**: next-i18next
- **UI Components**: Custom components with @heroui/react
- **HTTP Client**: Axios
- **Form Handling**: Native React forms

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
frontend/
├── components/         # Reusable React components
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── pages/             # Next.js pages
├── public/            # Static assets
│   └── locales/      # Translation files
├── services/          # API services
├── styles/           # Global styles
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Internationalization

The website supports multiple languages with automatic language detection. Translation files are located in `public/locales/`:

- English: `/public/locales/en/common.json`
- French: `/public/locales/fr/common.json`
- Arabic: `/public/locales/ar/common.json`

To add a new language:
1. Create a new translation file in `/public/locales/[lang]/common.json`
2. Add the language to the i18n configuration in `next-i18next.config.js`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License


    Travel Agency Website  © 2025 by Wael Bahi is licensed under CC BY-NC 4.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc/4.0/
