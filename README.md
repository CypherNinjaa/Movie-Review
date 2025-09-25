# 🎬 Movie Oracle - Movie Review App

A modern, responsive movie review application built with React, TypeScript, and Supabase. Discover movies, write reviews, and manage your watchlist with a cinematic user experience.

![Movie Oracle](https://img.shields.io/badge/Movie-Oracle-gold?style=for-the-badge&logo=react)

## ✨ Features

- 🔍 **Movie Discovery**: Browse trending, popular, and top-rated movies
- ⭐ **Movie Reviews**: Write and manage detailed movie reviews with ratings
- 📝 **Watchlist**: Add movies to your personal watchlist
- 👤 **User Profiles**: Personalized profile with statistics and settings
- 🎨 **Cinematic UI**: Dark theme with gold accents and smooth animations
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 🔐 **Authentication**: Secure user authentication with Supabase
- 🎭 **Modern Stack**: Built with the latest web technologies

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS Modules with CSS Variables
- **Backend**: Supabase (Authentication, Database, RLS)
- **API**: The Movie Database (TMDB) API
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript support

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- TMDB API key

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/movie-oracle.git
cd movie-oracle
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TMDB_API_KEY=your_tmdb_api_key
```

### 4. Database Setup

1. Set up your Supabase project
2. Run the SQL scripts in the `supabase/` directory to create tables
3. Enable Row Level Security (RLS) policies

### 5. Start Development Server

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components
│   ├── movies/         # Movie-related components
│   ├── navigation/     # Navigation components
│   ├── reviews/        # Review components
│   └── ui/            # Basic UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and services
├── pages/              # Page components
├── providers/          # Context providers
├── routes/            # Route configuration
├── types/             # TypeScript type definitions
└── assets/            # Static assets
```

## 🎨 Design System

The app uses a cinematic design system with:

- **Colors**: Dark backgrounds with gold and platinum accents
- **Typography**: Hierarchical text styling with custom font weights
- **Spacing**: Consistent spacing using CSS variables
- **Components**: Reusable components with variants and states
- **Animations**: Smooth transitions and hover effects

## 🌐 API Integration

- **TMDB API**: Movie data, images, and metadata
- **Supabase**: User authentication, reviews, and watchlist storage

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 768px (tablet), 1024px (desktop)
- **Components**: Adaptive layouts and navigation

## 🔐 Authentication

- Supabase Auth with email/password
- Protected routes and user sessions
- Row Level Security for data protection

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie data
- [Supabase](https://supabase.com/) for backend services
- [Lucide](https://lucide.dev/) for beautiful icons
- [React](https://react.dev/) and [Vite](https://vitejs.dev/) for the development experience
