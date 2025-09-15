# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript compilation first)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Architecture

This is a React + TypeScript forex broker review platform called "BrokerAnalysis" built with Vite. The application helps users compare and analyze forex brokers.

### Key Technologies
- **React 19** with TypeScript
- **Vite** for build tooling
- **Supabase** for backend and authentication
- **TanStack Query** for data fetching and caching
- **React Router** for navigation
- **Tailwind CSS** with custom design system
- **Radix UI** components for accessibility
- **Framer Motion** for animations

### Project Structure
- `/src/pages` - Page components organized by feature
- `/src/components` - Reusable components (ui, layout, landing, auth)
- `/src/contexts` - React contexts (Auth, Theme)
- `/src/lib` - Utility libraries (supabase, react-query, utils)
- `/src/hooks` - Custom React hooks
- `/src/types` - TypeScript type definitions

### Database Schema
The application uses Supabase with two main tables:
- **users** - Authentication and user preferences
- **brokers** - Broker information and reviews

### Key Features
- Broker comparison and reviews
- User authentication and profiles
- AI-powered broker matching
- Trading simulator
- Learning hub
- Admin dashboard
- Responsive design with dark mode

### Component Patterns
- Uses Radix UI primitives for accessibility
- Tailwind CSS for styling with custom color system
- Class Variance Authority (CVA) for component variants
- Custom hooks for complex logic

### Environment Variables
Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Supabase connection.

### Build Process
- TypeScript compilation with `tsc -b`
- Vite build for bundling
- ESLint for code quality
- add to memory