# PixelArt Frontend

A resposive Angular 17 single-page application for creating, editing, and sharing pixel art, built as a full-stack showcase project with a Spring Boot/PostgreSQL backend.

## Architecture and Design

The application is structured around three NgModule feature modules with lazy loading to optimize initial bundle size, each with a clear boundary of responsibility:

- **LoginModule** — authentication flow (sign-in, sign-up, private profile)
- **PixelartModule** — all pixelart features (catalog, detail, create, edit, portfolio)
- **CoreModule** — shared services, HTTP interceptor, async validators

### - **Smart & Presentational Components**:
To maximize code reuse, a strict separation between data-aware "Pages" and stateless "Components" was implemented.
- **Pages**: (e.g., `PixelartFormPageComponent`) handle route parameters, data fetching, and side effects.
- **Components**: (e.g., `ManagePixelartComponent`) focus purely on UI and Canvas interactions. This allows the same editor engine to drive both "Create" and "Edit" flows without logic duplication.

### - **Canvas Logic Abstraction**:
Rather than cluttering components with low-level DOM logic, all Canvas API operations—including pixel-grid rendering, `ResizeObserver` scaling, and RGBA serialization—are encapsulated within a dedicated `CanvasService`.

### - **Security Implementation**:
- **XSS Mitigation**: JWTs are stored in-memory within the `AuthService` private state rather than `localStorage`.
- **Auth Flow**: An `HttpInterceptor` handles automatic Bearer token injection and watches for `401 Unauthorized` responses to trigger graceful session timeouts.
- **JWT Validation**: Client-side expiry checks are performed by decoding the JWT payload, preventing unnecessary API calls when a session has ended.

## Features

**- Interactive Canvas**: Resizable drawing area with real-time grid scaling.
**- Public Gallery**: Browse and view pixel art details without an account.
**- User Portfolio**: Private dashboard for managing personal creations.
**- Dynamic UI**: Conditional Edit/Delete actions based on ownership and auth status.
**- Smart Forms**: Real-time duplicate detection for emails and aliases via async validators.

## Prerequisites

- **Node.js**: 18.x or 20.x
- **Angular CLI**: 17.3.x (`npm install -g @angular/cli@17.3.17`)
- **npm**: 8.x or 9.x
- **Backend**: Spring Boot PixelArt API running on `http://localhost:8085`

## Quick start

```bash
git clone <repository-url>
cd pixelart-front
npm install
npm start
```

Navigate to `http://localhost:4200/`.

## Available commands

```bash
npm start          # Development server
npm run build      # Production build → dist/pixelart-front/
npm test           # Unit tests (Karma + Jasmine)
npm run watch      # Build in watch mode
```

## Project structure

- `src/app/core/`: Singleton services, interceptors, and global guards.
- `src/app/shared/`: Dumb components used across multiple modules.
- `src/app/pixelart/`: The core business logic, organized into `pages/` (smart) and `components/` (presentational).

## API configuration

Base URL is defined once in environment files — no hardcoded URLs in service classes:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8085/api'
};
```


## Roadmap & Ongoing Work

- **Route Guard Activation**: Finalizing `canActivate` implementation for stricter URL-based protection.
- **Session Persistence**: Implementing a token refresh flow once backend support is added.
- **Cookie Migration**: Moving toward `httpOnly` cookies to implement CSRF protection.
- **Testing**: Expanding unit test coverage for the `CanvasService` rendering logic.