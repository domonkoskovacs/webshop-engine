# Frontend project

This is the frontend application for the Webshop engine, 
built with **React**, **Vite**, and **TypeScript**. 
It features a modular architecture with a shared design system, admin dashboard,
and storefront view. The project uses **Tailwind CSS**, **ShadCN UI**, **TanStack Query**, 
and **React Hook Form + Zod** for state and form handling.

---

## Features

- Vite + React + TypeScript
- Tailwind CSS with ShadCN UI components
- TanStack Query for state management
- Form validation with React Hook Form + Zod
- Modular directory structure (admin/storefront separation)
- OpenAPI client (generated and committed)
- Testing with Vitest + Testing Library
- ESLint, strict TypeScript setup

---

## Project Structure

```
src/
├── assets/        # Static assets
├── components/    # Component structure
│   ├── admin/     # Admin-specific UI
│   ├── storefront/# Storefront-specific UI
│   ├── shared/    # Reusable components
│   └── ui/        # ShadCN components + wrappers
├── contexts/      # React context providers
├── hooks/         # Reusable hooks
├── layouts/       # Page layouts
├── lib/           # Utility functions and config
├── pages/         # Route-mapped page components
├── routing/       # Router config and helpers
├── services/      # API clients (OpenAPI-generated wrappers)
├── shared/        # Shared constants, helpers
├── types/         # Global TypeScript types
├── App.tsx
└── main.tsx
```

---

## Getting Started

Install dependencies:

```bash
npm install
```

Start local dev server:

```bash
npm run dev
```

> The backend must be running for the frontend to function correctly. Start there if it is not running.

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run tests:

```bash
npm run test
```

Run tests with coverage report:

```bash
npm run test:coverage
```

---

## Backend Integration

This frontend connects to the backend via OpenAPI-generated services. The OpenAPI client code is generated and committed.

To regenerate the API (if backend api changes):

```bash
npm run generate-api
```

---

## Stack

- **Vite** — fast build tool and dev server
- **React 19** — modern UI with concurrent rendering
- **Tailwind CSS 4** — utility-first styling
- **ShadCN/UI** — accessible and styled component primitives
- **React Router v7** — declarative routing
- **TanStack Query v5** — data fetching and caching
- **React Hook Form** + **Zod** — powerful forms and validation
- **Vitest** — unit and component testing
- **OpenAPI Generator** — API client sync with backend

---

## Environment Variables

This project reads `VITE_`-prefixed environment variables at build time.

Example `.env`:

```dotenv
VITE_API_URL=http://localhost:8080
```
 Specify VITE_STRIPE_PUBLISHABLE_KEY for Stripe usage 

---

## Linting

Run ESLint:

```bash
npm run lint
```

---

## Notes

- The backend must be running for the API and forms to work.
- Stripe checkout, image upload, and authenticated actions depend on backend logic.
- All backend-related URLs are configured via `VITE_API_URL`.
