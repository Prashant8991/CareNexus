# AI Health Companion

## Overview

AI Health Companion is a comprehensive healthcare web application that provides users with AI-powered health analysis tools, emergency assistance features, and health tracking capabilities. The application focuses on accessibility, trust, and medical-grade design patterns to create a reliable digital health assistant.

The platform offers four core features: AI-powered skin analysis through image uploads, comprehensive first aid guidance with emergency protocols, hospital location services with real-time information, and emergency SOS functionality with contact management. Additionally, it includes a personal health dashboard for tracking metrics and maintaining health records.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based architecture with TypeScript, built on Vite for fast development and optimized production builds. The UI framework leverages shadcn/ui components with Radix UI primitives, providing accessible and customizable interface elements. The design system implements a healthcare-focused theme with medical color palettes, featuring deep medical blues, health greens, and emergency reds.

The routing is handled by Wouter for lightweight client-side navigation, while state management utilizes React Query (TanStack Query) for server state management and React's built-in state management for local UI state. The styling approach combines Tailwind CSS for utility-first styling with CSS custom properties for theme variables, supporting both light and dark modes.

### Backend Architecture
The backend follows a Node.js/Express.js architecture with TypeScript, providing a RESTful API structure. The server implements middleware for request logging, JSON parsing, and error handling. The application uses a modular route registration system that allows for scalable API endpoint management.

For development, the backend integrates with Vite's development server using middleware mode, enabling hot module replacement and seamless full-stack development. The production build process uses esbuild for efficient server-side bundling.

### Data Storage Solutions
The application uses Drizzle ORM with PostgreSQL for database operations, configured through the @neondatabase/serverless driver for cloud-native database connectivity. The schema is defined in TypeScript with Zod validation for type safety and runtime validation.

Currently, the application includes a memory storage implementation for development and testing, with interfaces designed for easy migration to the full PostgreSQL implementation. The storage layer supports user management with username/password authentication patterns.

### Authentication and Authorization
The authentication system is designed around user sessions with support for secure credential storage. The current implementation includes user creation and retrieval methods, with password hashing and session management planned for production deployment.

### Component Architecture
The application follows a component-driven architecture with reusable UI components organized in a clear hierarchy:

- **Core Components**: Navigation, ThemeProvider, and utility components
- **Feature Components**: HealthCard, ImageUpload, EmergencyButton for specific functionality
- **UI Components**: Complete shadcn/ui component library with custom styling
- **Page Components**: Route-specific components for each application section

The design system emphasizes accessibility with proper ARIA labels, keyboard navigation support, and screen reader compatibility. Components are built with responsive design principles and support both light and dark themes.

### Development and Build System
The project uses a monorepo structure with shared TypeScript types and utilities. The development environment supports hot reloading, TypeScript checking, and automated builds. The configuration includes path aliases for clean imports and proper module resolution.

Build optimization includes code splitting, asset optimization, and production-ready deployments with environment-specific configurations.

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives for React
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Pre-built component library built on Radix UI primitives
- **Lucide React**: Icon library providing medical and health-focused iconography
- **class-variance-authority**: Type-safe component variants and styling
- **clsx/tailwind-merge**: Utility functions for conditional CSS class composition

### State Management and Data Fetching
- **TanStack React Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management with validation
- **Hookform Resolvers**: Integration between React Hook Form and validation libraries

### Development and Build Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **TypeScript**: Type safety and enhanced developer experience
- **esbuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Database and Backend
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL database service
- **Drizzle Kit**: Database migrations and schema management tools
- **Zod**: Runtime type validation and schema definition

### Routing and Navigation
- **Wouter**: Lightweight client-side routing library
- **React Router concepts**: Navigation patterns and route management

### Planned Integrations
- **Medical APIs**: For skin analysis, health data, and medical information
- **Twilio**: SMS and voice services for emergency contact features
- **Google Maps API**: Hospital location services and mapping functionality
- **Healthcare databases**: Medical condition information and first aid protocols

The architecture is designed to accommodate these future integrations while maintaining clean separation of concerns and scalable code organization.