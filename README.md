# PixelArt Frontend

Welcome to PixelArt Frontend! 🎨 This is an Angular 17 application for creating and sharing pixel art.

## ✨ Features

### 🎨 Core Functionality
- **User Authentication**: Secure login and registration system with JWT tokens
- **Pixel Art Creation**: Interactive canvas for creating pixel art
- **User Profiles**: Personal profile management and settings
- **Art Gallery**: Browse and view pixel art creations
- **Responsive Design**: Mobile-first design that works on all devices

### 🔧 Technical Features
- **Real-time Canvas**: Live preview and immediate updates
- **File Management**: Save, load, and export pixel art projects
- **Performance Optimized**: Fast loading with lazy-loaded modules
- **Error Handling**: User-friendly error messages and validation

## 🛠️ Development Competencies

### Frontend Architecture
- **Angular 17**: Modern Angular framework with standalone components
- **TypeScript**: Strongly typed development for better code quality
- **RxJS**: Reactive programming for state management and HTTP requests
- **Angular Material**: Consistent UI components and design system

### Code Quality & Testing
- **Modular Architecture**: Well-organized component and service structure
- **HTTP Interceptors**: Centralized authentication and error handling
- **Lazy Loading**: Optimized module loading for better performance
- **Environment Configuration**: Flexible deployment for different environments

## Prerequisites

Before you start, make sure you have these installed:

- **Node.js**: 18.20.8 (use `nvm use` to switch automatically)
- **npm**: 10.8.2 or later
- **Angular CLI**: 17.3.17

## Quick Start

Here's how to get up and running quickly:

```bash
# Clone and install
git clone <repository-url>
cd pixelart-front
npm install

# Start development server
npm start
# or
ng serve
```

Then open your browser and navigate to `http://localhost:4200/` 🚀

## Development

### Available Commands
```bash
npm start          # Start dev server
ng serve           # Alternative way to start dev server
npm run build      # Build for production
npm test           # Run unit tests
npm run watch      # Build in watch mode
```

### Project Structure
```
src/app/
├── core/          # Services, interceptors
├── shared/        # Header, footer components
├── login/         # Authentication (login, signup, profile)
├── pixelart/      # Main app features (catalog, create, detail)
└── http-interceptors/  # HTTP request handling
```

## API Configuration

The app connects to a backend API at `http://localhost:8085/api`

You can configure the endpoints in:
- `src/environments/environment.ts` (for development)
- `src/environments/environment.prod.ts` (for production)

## Key Dependencies

- **Angular**: 17.3.12
- **Angular Material**: 17.3.10
- **RxJS**: 7.8.2
- **TypeScript**: 5.4.5

## Building

```bash
# Development build
ng build

# Production build
ng build --configuration production
```

Your built files will be in `dist/pixelart-front/`

## Testing

```bash
npm test
```

Run your tests with the `ng test` command. The test environment is already configured and ready to go! 🧪

## Common Issues

Don't worry if you run into these - here are quick fixes:

1. **Node version**: Use `nvm use` to get the correct version (18.20.8)
2. **Port conflicts**: Angular CLI will automatically suggest an alternative port
3. **Dependencies**: Run `npm install` if you get missing dependency errors

## Contributing

We'd love your help! Here's how to contribute:

1. Fork the repository
2. Create a feature branch
3. Follow the Angular style guide
4. Write tests for new features
5. Submit a pull request

Thanks for contributing! 🙌
