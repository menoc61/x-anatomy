[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/menoc61/x-anatomy)
# Anatomy Explorer

An interactive web application designed for exploring the human muscular system in detail. Built with Next.js, TypeScript, and Tailwind CSS, this application offers a rich learning experience for students, professionals, and enthusiasts interested in human anatomy.

**Author:** Gilles Momeni
**Contact:** gillemomeni@gmail.com

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Development Server](#running-the-development-server)
- [Key Functionality](#key-functionality)
  - [User Features](#user-features)
  - [Admin Features](#admin-features)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Overview
Anatomy Explorer provides an immersive platform to learn about human muscles. Users can interact with 2D diagrams and (for subscribers) 3D models, view detailed information about muscle origins, insertions, functions, related conditions, and watch relevant videos. The application includes user authentication, subscription management, and an administrative backend for content management.

## Features
- **Interactive Anatomy Viewer:** Explore muscles using 2D diagrams and optional 3D models (via Sketchfab integration).
- **Detailed Muscle Information:** Access comprehensive data including name, description, origin, insertion, functions, common conditions, and associated videos.
- **User Authentication:** Secure signup, login, and password management (e.g., forgot password).
- **Subscription System:** Tiered access (e.g., Basic, Premium, Professional) potentially unlocking features like 3D models. Includes trial periods.
- **Admin Dashboard:** Manage users, muscle data, video content, subscriptions, and system settings.
- **Responsive Design:** Adapts to various screen sizes (desktop, tablet, mobile).
- **Internationalization (i18n):** Supports multiple languages.
- **Theming:** Light and dark mode support.
- **Offline Support:** Basic offline page via Service Worker.

## Technology Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & shadcn/ui component library
- **State Management:** React Context API, Zustand (check `lib/store.ts`)
- **Database ORM:** Prisma
- **Database:** PostgreSQL (or compatible SQL database)
- **Authentication:** NextAuth.js (likely, based on structure - needs verification) or custom JWT implementation (check `lib/auth.ts`)
- **3D Model Viewer:** Sketchfab API integration
- **Linting/Formatting:** ESLint, Prettier, cspell
- **Package Manager:** pnpm

## Project Structure
*(A brief overview of the main directories)*
- `app/`: Core application routing and pages (App Router).
  - `(auth)/`: Authentication-related pages (login, signup, forgot password).
  - `(main)/`: Main application pages for logged-in users.
  - `admin/`: Administrative section pages and layout.
  - `api/`: Server-side API route handlers.
- `components/`: Reusable React components.
  - `ui/`: Base UI components (likely from shadcn/ui).
  - `layout/`: Components related to page structure (headers, sidebars).
- `contexts/`: React Context providers (Auth, Language, i18n).
- `hooks/`: Custom React hooks.
- `lib/`: Utility functions, database connection, authentication logic, data definitions.
- `prisma/`: Database schema definition (`schema.prisma`).
- `public/`: Static assets (images, logos).
- `types/`: TypeScript type definitions.

## Getting Started

### Prerequisites
- Node.js (Version specified in `.nvmrc` or `package.json`, e.g., v18+)
- pnpm (Package manager)
- PostgreSQL Database (or configure Prisma for a different database)

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/menoc61/anatomy-explorer.git
    cd anatomy-explorer
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```

### Environment Variables
1.  Create a `.env.local` file in the root directory.
2.  Add necessary environment variables. Key variables likely include:
    - `DATABASE_URL`: Connection string for your PostgreSQL database (e.g., `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`)
    - `NEXTAUTH_URL`: The base URL of your application (e.g., `http://localhost:3000`)
    - `NEXTAUTH_SECRET`: A secret key for NextAuth.js (generate one using `openssl rand -base64 32`)
    - `SKETCHFAB_API_TOKEN`: (If needed for specific API interactions beyond embedding)
    - *(Add any other required variables based on `lib/auth.ts`, API clients, etc.)*

### Running the Development Server
1.  Ensure your database is running.
2.  Apply database migrations:
    ```bash
    pnpm prisma migrate dev
    ```
    *(You might need to seed the database if seed scripts exist)*
    ```bash
    # Example: pnpm prisma db seed 
    ```
3.  Start the development server:
    ```bash
    pnpm dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Functionality

### User Features
- Browse and select muscle groups/muscles.
- View detailed anatomical information and images.
- Interact with 2D/3D models.
- Watch related videos.
- Manage account profile and subscription.
- Change language and theme preferences.

### Admin Features
- **User Management:** View, add, edit, delete users; manage roles and status.
- **Content Management:** Add/edit muscle data, upload/manage videos.
- **Subscription Management:** View and potentially manage user subscriptions.
- **System Settings:** Configure application parameters.
- **Backup/Database:** Tools for managing application data.

## API Documentation
Detailed information about the available API endpoints, request/response formats, authentication requirements, and usage examples can be found in [API_README.md](API_README.md).

## Database Schema
The database structure, including table definitions, relationships, and constraints, is documented in [SCHEMA_README.md](SCHEMA_README.md). The schema is managed using Prisma.

## Authentication
Authentication is handled via [Specify Method - e.g., NextAuth.js with credentials/OAuth providers, Custom JWT]. Refer to `lib/auth.ts` and `app/api/auth/` for implementation details.

## Deployment
*(Provide instructions or link to documentation on deploying the Next.js application, e.g., to Vercel, Netlify, AWS, etc.)*

Example (Vercel):
1.  Push the code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Connect the repository to your Vercel account.
3.  Configure environment variables in the Vercel project settings.
4.  Deploy! Vercel will typically auto-detect the Next.js project and build/deploy it.

## Contributing
*(Optional: Add guidelines for contributing if this is an open project)*
