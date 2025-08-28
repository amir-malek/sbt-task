# Blog Platform

A modern, responsive blog platform built with Next.js 15, showcasing clean architecture and best practices. Features articles listing, detailed views, comments system, and PWA capabilities.

## 🚀 Features

- **Articles Management**: Browse and read articles with infinite scroll pagination
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Comments System**: View and interact with article comments
- **Progressive Web App**: Offline support and installable experience
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS, React Query
- **Clean Architecture**: Repository pattern, proper error handling, comprehensive testing

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn/UI
- **State Management**: Zustand + React Query

### Features
- **Data Fetching**: React Query with infinite scroll
- **PWA**: next-pwa with offline caching
- **Forms**: React Hook Form
- **Testing**: Jest + React Testing Library + Playwright

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Clone repository
git clone <repository-url>
cd blog-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 🧪 Testing

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Tests
```bash
# Run end-to-end tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run performance tests
npm run test:performance
```

### Test Coverage
The project maintains high test coverage with:
- Unit tests for components, hooks, and utilities
- Integration tests for critical user flows
- E2E tests for complete user journeys
- Performance audits with Lighthouse

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── ui/                # Shadcn/UI base components
│   ├── common/            # App-specific components
│   ├── articles/          # Article-related components
│   └── comments/          # Comment-related components
├── lib/                   # Utilities and configurations
│   ├── api/              # API repository layer
│   ├── stores/           # Zustand stores
│   ├── providers/        # React context providers
│   └── utils/            # Helper functions
├── types/                 # TypeScript type definitions
└── hooks/                # Custom React hooks
```

### Key Patterns
- **Repository Pattern**: Abstracts API calls for better testing and maintenance
- **Component Composition**: Reusable, single-responsibility components
- **Custom Hooks**: Encapsulated logic for data fetching and state management
- **Error Boundaries**: Graceful error handling throughout the application
- **Progressive Enhancement**: Core functionality works without JavaScript

## 🚀 Deployment

### Build
```bash
# Create production build
npm run build

# Start production server
npm start
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.realworld.io/api
```

### PWA Features
- Offline caching for visited pages
- App installation prompt
- Service worker for background sync
- Optimized loading strategies

## 🔧 Development

### Code Quality
- **ESLint**: Code linting and style enforcement
- **TypeScript**: Strict typing for better developer experience
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for quality control

### Performance Optimizations
- Next.js App Router with ISR
- React Query caching and deduplication  
- Image optimization
- Bundle splitting
- PWA caching strategies

## 📋 API Integration

### RealWorld API
This project integrates with the [RealWorld API](https://api.realworld.io/api) (Conduit):

**Endpoints Used:**
- `GET /articles` - List articles with pagination
- `GET /articles/:slug` - Get article details
- `GET /articles/:slug/comments` - Get article comments
- `GET /tags` - Get available tags

### Data Models
The application uses well-defined TypeScript interfaces matching the API schema:
- Article, Author, Comment types
- Proper error handling and loading states
- Optimistic updates where applicable

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

### Coding Standards
- Follow TypeScript strict mode
- Write tests for new features
- Use conventional commit messages
- Ensure responsive design
- Maintain accessibility standards

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [RealWorld API](https://realworld-docs.netlify.app/) for the backend service
- [Shadcn/UI](https://ui.shadcn.com/) for the component library
- [Next.js](https://nextjs.org/) team for the excellent framework
