# Agent Guidelines: TWICE Buy Website

This document provides essential information and guidelines for agentic coding agents working in this repository.

## 1. Project Overview
This is a Proxy Buying Service website for TWICE merchandise, built with Next.js 16 and Firebase. The project facilitates international fans purchasing items from Korea/Japan. 

### Core Payment Flow
The core feature is a two-stage payment system designed to handle unknown shipping costs:
1. **Stage 1 (Product Cost)**: User pays the fixed price of the item. This allows the proxy service to purchase the item immediately.
2. **Warehouse Arrival**: The item is received at the proxy warehouse, weighed, and measured.
3. **Stage 2 (Shipping & Handling)**: The user is notified of the final shipping cost. Once paid, the item is shipped to their international address.

## 2. Tech Stack
- **Frontend Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x with PostCSS
- **Backend/BaaS**: Firebase
    - **Authentication**: Email/Password and Social Providers
    - **Firestore**: NoSQL database for products, orders, and user profiles
    - **Cloud Storage**: For product images and user uploads
    - **Cloud Functions**: For server-side logic (payment processing, notifications)
- **Package Manager**: npm

## 3. Build, Lint, and Test Commands

### Development
- `npm run dev`: Starts the development server.
- `cd functions && npm run serve`: Starts Firebase Emulators for functions.

### Build & Lint
- `npm run build`: Builds the Next.js application.
- `npm run lint`: Runs ESLint for the Next.js project.
- `cd functions && npm run build`: Compiles TypeScript functions to JavaScript.

### Testing
*Note: Currently, there is no formal test framework configured in the root project. When adding tests, prefer Vitest for Next.js and Jest for Cloud Functions.*
- **Single Test (Proposed)**: `npx vitest run path/to/file.test.ts` (if Vitest is added).
- **Functions Tests**: `cd functions && npm test`.

### Firebase
- `firebase deploy --only hosting`: Deploys the frontend.
- `firebase deploy --only functions`: Deploys Cloud Functions.
- `firebase emulators:start`: Starts all Firebase emulators.

## 4. Code Style Guidelines

### 4.1 Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard.tsx`, `Navbar.tsx`).
- **Files**:
    - Components: PascalCase.
    - Hooks: camelCase starting with `use` (e.g., `useAuth.ts`).
    - Utilities/Libs: camelCase (e.g., `firebase.ts`).
    - Types: `index.ts` within `types/` or camelCase.
- **Variables & Functions**: camelCase.
- **Constants**: UPPER_SNAKE_CASE.
- **Interfaces/Types**: PascalCase. Prefix interfaces with `I` only if it matches existing project patterns (currently not used).

### 4.2 Imports & Formatting
- **Absolute Imports**: Always use the `@/` prefix for paths within the `app`, `components`, `lib`, and `types` directories as configured in `tsconfig.json`.
- **Order**:
    1. React/Next.js core imports.
    2. Third-party libraries (Firebase, etc.).
    3. Components (`@/components/...`).
    4. Hooks/Utilities (`@/lib/...`).
    5. Types (`@/types/...`).
    6. Styles/Assets.
- **Formatting**: Adhere to the `.eslintrc.json` (Next.js defaults). Use 2 spaces for indentation.

### 4.3 TypeScript & Data Models
- **Strong Typing**: Avoid `any`. Define interfaces for all data models.
- **Centralized Types**: Shared types must be placed in `types/index.ts`.
- **Firebase Types**: Use types from `firebase/firestore` and `firebase/auth` for database and authentication objects.
- **Enums**: Use string literal types instead of Enums for status fields (see `OrderStatus` in `types/index.ts`).

#### Core Models
- `Product`: Contains `price_stage1` and `price_stage2`. `price_stage2` is often undefined initially.
- `Order`: Tracks `stage1_paid` and `stage2_paid` booleans and their respective timestamps.
- `OrderStatus`: Tracks the lifecycle from `Pre-order` to `Delivered`.

### 4.4 Component Structure
- **Functional Components**: Use `export default function Name() { ... }` for primary components.
- **Client vs. Server**: Next.js App Router uses Server Components by default. Use `'use client'` only when necessary for interactivity or browser APIs.
- **Tailwind CSS**: Use utility classes for styling. Follow the mobile-first approach.
- **Props**: Use inline destructuring for props with explicit TypeScript types.

### 4.5 Error Handling & Logging
- **Try-Catch**: Wrap all external API calls and Firebase operations in `try-catch` blocks.
- **User Feedback**: Implement proper loading states and error messages in the UI.
- **Logging**: Use `console.error` for critical errors. For Cloud Functions, use `firebase-functions/logger`.

### 4.6 Firebase Best Practices
- **Initialization**: Use `lib/firebase.ts` for all Firebase service instances. Do not initialize Firebase multiple times.
- **Firestore**:
    - Use converter functions where appropriate to maintain type safety.
    - Keep security rules in `firestore.rules` updated.
- **Functions**:
    - Keep function logic modular in `functions/src/`.
    - Use `onCall` for client-triggered logic and `onDocumentCreated`/`onDocumentUpdated` for triggers.

## 5. Directory Structure
- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components.
- `lib/`: Configuration and utility libraries (Firebase, etc.).
- `types/`: Global TypeScript definitions.
- `functions/`: Firebase Cloud Functions source code.
- `public/`: Static assets.

## 6. Development Workflow for Agents
1. **Understand**: Read existing components and types before creating new ones.
2. **Implement**: Follow the two-stage payment logic consistently across frontend and backend.
3. **Verify**: Run `npm run lint` and `npm run build` (or `tsc` in functions) before finalizing changes.
4. **Style**: Ensure Tailwind classes are clean and responsive.

### 6.1 Common Patterns
- **Data Fetching**: Use Server Components with `async/await` for initial data fetching.
- **Form Handling**: Use React Server Actions or standard Client-side forms with loading states.
- **Responsive Design**: Use Tailwind's prefix classes (`sm:`, `md:`, `lg:`) for all layouts.
- **Icons**: If icons are needed, verify if a library like `lucide-react` is installed; otherwise, use SVG or emojis as placeholders.

### 6.3 State Management
- **Local State**: Use `useState` for component-level state (modals, form inputs).
- **Server State**: Rely on Next.js caching and revalidation for server data.
- **Global State**: Use React Context for global UI state (e.g., AuthContext, ThemeContext) if needed. Avoid heavy external state libraries (Redux/Zustand) unless complexity demands it.

### 6.4 Security Considerations
- **Environment Variables**: Never hardcode secrets. Use `.env.local` for client-side keys (prefixed with `NEXT_PUBLIC_`) and Firebase config.
- **Firestore Rules**: Always check `firestore.rules` when adding new collections to ensure data is protected.
- **Authentication**: Use the `useAuth` hook (if implemented) to protect client-side routes.

## 7. Git & Commit Guidelines
- **Conventional Commits**: Use the conventional commit format:
    - `feat: add two-stage payment calculation`
    - `fix: resolve hydration error in Navbar`
    - `refactor: extract Firebase logic to custom hook`
    - `style: update Tailwind classes for mobile`
    - `docs: update AGENTS.md`
- **Atomic Commits**: Keep commits focused on a single logical change.

## 8. Cursor/Copilot Rules
- Follow instructions in `.cursorrules` if present (currently none found).
- Adhere to the "Next.js core-web-vitals" and "next/typescript" ESLint configs.
- Prefer explicit types over inferred types for public API/function signatures.

---
*Created for autonomous agents to ensure consistency and quality in the TWICE Buy Website codebase.*
