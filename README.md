# Blog Platform

A modern, responsive blog platform built with Next.js 15, showcasing clean architecture and best practices. Features articles listing, detailed views, comments system, and comprehensive PWA capabilities with manual service worker implementation.

## 🚀 Features

- **Articles Management**: Browse and read articles with infinite scroll pagination
- **Responsive Design**: Optimized for mobile, tablet, and desktop experiences
- **Comments System**: View and interact with article comments with real-time refresh
- **Progressive Web App**: Complete offline support, install prompts, and background sync
- **Manual Service Worker**: Custom PWA implementation without external dependencies
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS 4, React Query, Zustand
- **Clean Architecture**: Repository pattern, error boundaries, comprehensive testing suite

## 🛠️ Tech Stack

### Core Framework
- **Framework**: Next.js 15 with App Router and TypeScript strict mode
- **Styling**: Tailwind CSS 4 with Shadcn/UI component library
- **State Management**: Zustand for global state + React Query for server state

### PWA & Offline Features
- **Service Worker**: Manual implementation using esbuild for optimal control
- **Caching Strategy**: Network-first with cache fallback for navigation requests
- **Offline Support**: Custom offline page with cached content access
- **Build Process**: Automated service worker generation with precache manifest
- **Background Sync**: Message handling between main thread and service worker

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd shahbet-task

# Install dependencies
pnpm install

# Build service worker and start development
pnpm run build:sw
pnpm run dev

# Open http://localhost:3000
```

### PWA Build Process
The project uses a custom service worker build system:

```bash
# Build service worker only
pnpm run build:sw

# Full production build (includes service worker)
pnpm run build

# The build process:
# 1. Scans public/ directory for static assets
# 2. Generates precache manifest with file hashes
# 3. Bundles worker/index.js with esbuild
# 4. Outputs optimized /public/sw.js
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

## 📱 PWA Features & Offline Support

### Manual Service Worker Implementation
This project implements a **fully manual PWA solution** without external dependencies like `next-pwa` or `workbox`. This provides complete control over caching strategies and offline behavior.

#### Architecture Overview
```
├── worker/                     # Service Worker Source
│   └── index.js               # Manual SW implementation
├── scripts/
│   └── build-sw.js           # SW build process
└── public/
    ├── sw.js                 # Built service worker
    ├── manifest.json         # PWA manifest
    └── [static assets]       # Auto-cached resources
```

#### Caching Strategies

**Static Assets (Cache-First)**
- Images, fonts, icons
- Cached indefinitely with cache busting

**Navigation Requests (Network-First with Fallback)**
- HTML pages try network first (3s timeout)
- Falls back to cache if available
- Shows custom offline page as final fallback

**API Requests (Network-First)**
- Real-time data prioritized
- Cached responses used when offline
- Automatic retry on connection restore

#### Offline Capabilities

**Custom Offline Page** (`/offline`)
- Displays when navigation fails offline
- Shows cached articles list
- Provides navigation to cached pages
- Connection status indicator

**Offline-First Features**
- Install prompts for supported browsers
- Background sync for queued actions
- Service worker update notifications
- Message passing between SW and main thread

#### Testing Offline Mode

1. **Development Testing**
   ```bash
   # Start the development server
   pnpm run dev
   
   # In Chrome DevTools:
   # 1. Go to Application → Service Workers
   # 2. Check "Offline" checkbox
   # 3. Navigate to any page to see offline behavior
   ```

2. **Production Testing**
   ```bash
   pnpm run build
   pnpm start
   
   # Disable network in browser DevTools
   # Navigate to test cached/offline pages
   ```

#### PWA Installation
- Automatic install prompts on supported browsers
- Custom install button component
- Proper manifest configuration with icons
- iOS and Android support

## 🔧 Development

### Code Quality
- **ESLint**: Code linting and style enforcement
- **TypeScript**: Strict typing for better developer experience
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for quality control

### Performance Optimizations
- Next.js App Router with ISR (3600s revalidation)
- React Query caching and deduplication with infinite scroll
- Next.js Image optimization with remote patterns
- Automatic bundle splitting and code splitting
- Custom PWA caching strategies optimized for blog content
- Service worker precaching of critical assets
- Network-first with timeout for optimal perceived performance

### Service Worker Development

**Local Development**
```bash
# The service worker is built automatically during development
pnpm run build:sw

# Watch for changes (manual rebuild required)
# Edit worker/index.js then run build:sw
```

**Service Worker Architecture**
- **Cache Management**: Automatic cleanup of old cache versions
- **Network Strategies**: Configurable per resource type
- **Error Handling**: Graceful fallbacks for all request types
- **Background Sync**: Queued actions for offline scenarios
- **Update Lifecycle**: Proper SW update notifications

**Debugging Service Worker**
```bash
# Enable detailed logging in worker/index.js
console.log('Service Worker: [event] details...')

# Chrome DevTools → Application → Service Workers
# View registration status, update cycles, and cache storage
```

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
