# Architecture & Design Documentation

## Overview

This document outlines the architecture and design patterns used in the TDK BI Dashboard application, covering both frontend and backend implementations.

---

## Frontend Architecture

### 1. Atomic Design Pattern

The frontend follows an atomic design methodology for component organization:

```
src/
├── pages/              # Page level (Dashboard)
│   └── Dashboard/
│       ├── Dashboard.tsx          # Page component
│       └── components/            # Organisms
│           ├── DashboardHeader.tsx
│           ├── DashboardKPIs.tsx
│           ├── DashboardCharts.tsx
│           └── DashboardFooter.tsx
├── components/          # Reusable components
│   ├── charts/         # Chart system
│   │   ├── generic/    # Generic chart components (atoms)
│   │   └── dashboard/ # Dashboard-specific charts (molecules)
│   ├── KPICard.tsx
│   ├── FilterBar.tsx
│   └── TopUsersTable.tsx
├── hooks/              # Custom React hooks
├── services/           # API service layer
└── utils/              # Utility functions
```

**Benefits:**
- Clear component hierarchy
- Reusable components at different levels
- Easy to locate and maintain components

### 2. Service Layer Pattern

**CoreAPIService.ts**
- Centralized Axios instance with interceptors
- Handles request/response transformation
- Extracts nested `data` field from backend responses
- Standardized error handling

**dashboardService.ts**
- Typed API methods for all dashboard endpoints
- Type-safe request/response interfaces
- Clean separation of API logic from components

**Benefits:**
- Single source of truth for API configuration
- Easy to mock for testing
- Type safety throughout the application

### 3. Custom Hooks Pattern

**useDashboardData.ts**
- Manages all dashboard data fetching
- Implements parallel API calls with per-endpoint loading states
- Debounced filter changes (300ms delay)
- Request cancellation to prevent stale updates
- Progressive data loading (UI updates as data arrives)

**Features:**
- Individual loading states for each endpoint
- Debouncing to prevent excessive API calls
- Request ID tracking to invalidate stale responses
- Graceful error handling with fallback values

### 4. Reusable Chart System

**Generic Chart Components:**
- `PieChart`, `BarChart`, `AreaChart`, `LineChart`, `ComposedChart`, `TreemapChart`
- Located in `components/charts/generic/`
- Fully reusable with configurable props

**Dynamic Chart Component:**
- `Chart` component with type-safe dynamic rendering
- Uses a chart map to render appropriate chart type
- Supports all chart types through unified interface

**Dashboard-Specific Charts:**
- Located in `components/charts/dashboard/`
- Use generic charts internally
- Handle data transformation and formatting
- Single source of truth: charts receive data as props (no direct API calls)

**Benefits:**
- DRY principle: no code duplication
- Easy to add new chart types
- Consistent styling and behavior
- Type-safe chart rendering

### 5. Progressive Loading & UX

**Skeleton Loaders:**
- `KPICardSkeleton` for KPI cards
- `ChartSkeleton` for charts
- Smooth loading transitions

**Progressive Data Display:**
- Per-endpoint loading states
- Data displays immediately when available
- No blocking "wait for all" behavior
- Old data remains visible during filter changes

**Benefits:**
- Better perceived performance
- Improved user experience
- No flickering during data updates

---

## Backend Architecture

### 1. Modular MVC Pattern

The backend follows a modular MVC (Model-View-Controller) architecture:

```
src/
├── modules/            # Feature modules
│   ├── user/          # User module
│   │   ├── user.model.ts       # Data models/DTOs
│   │   ├── user.schema.ts      # Mongoose schema
│   │   ├── user.repository.ts # Data access layer
│   │   ├── user.service.ts    # Business logic
│   │   ├── user.controller.ts # HTTP handlers
│   │   └── user.route.ts      # Route definitions
│   ├── transaction/   # Transaction module (same structure)
│   └── dashboard/     # Dashboard module (same structure)
├── middleware/         # Express middleware
├── utils/             # Shared utilities
└── config/            # Configuration
```

**Module Structure:**
- **Model**: TypeScript interfaces and DTOs
- **Schema**: Mongoose schema definitions
- **Repository**: Data access layer (MongoDB operations)
- **Service**: Business logic layer
- **Controller**: HTTP request/response handling
- **Route**: Express route definitions

**Benefits:**
- Clear separation of concerns
- Easy to add new modules
- Scalable architecture
- Testable components

### 2. Repository Pattern

**Implementation:**
- `UserRepository`, `TransactionRepository` handle all MongoDB operations
- Abstracts database queries from business logic
- Maps MongoDB documents to application models
- Handles field name transformations (PascalCase → camelCase)

**Benefits:**
- Data access abstraction
- Easy to switch databases
- Testable with mock repositories
- Centralized query logic

### 3. Service Layer Pattern

**Service Classes:**
- `UserService`, `TransactionService`, `DashboardService`
- Contains all business logic
- Uses repositories for data access
- Throws custom error classes for error handling

**DashboardService:**
- Aggregates data from multiple repositories
- Complex business logic for analytics
- Efficient data processing and transformation

**Benefits:**
- Business logic separation
- Reusable across different controllers
- Easy to test business rules
- Clean controller code

### 4. Controller Layer

**Responsibilities:**
- HTTP request/response handling
- Request validation
- Response formatting
- Error handling via `asyncHandler`

**Pattern:**
- All 28 controller methods use `asyncHandler` wrapper
- Standardized responses using `successResponse`/`errorResponse`
- Clean, focused code

**Example:**
```typescript
getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await this.service.getUserById(req.params.id);
  const response = successResponse(AppMessages.USER_FOUND, user);
  res.json(response);
});
```

### 5. Error Handling System

**Custom Error Classes:**
- `AppError` - Base error class
- `NotFoundError` - 404 errors
- `ValidationError` - 400 errors
- `UnauthorizedError` - 401 errors
- `ForbiddenError` - 403 errors

**Error Handling Middleware:**
- Global `errorHandler` middleware
- `notFoundHandler` for 404 routes
- `asyncHandler` wrapper for async route handlers
- Centralized error logging

**Benefits:**
- Consistent error responses
- Proper error propagation
- Easy error handling
- Development vs production error details

### 6. Standardized API Responses

**Response DTOs:**
- `createResponseDto` utility for consistent response format
- All responses follow: `{ statusCode, status, message, data }`
- `successResponse` and `errorResponse` helpers

**AppMessages:**
- Centralized message management
- Consistent messaging across the application
- Easy to update messages

**Benefits:**
- Consistent API contract
- Easy to parse responses
- Better error messages
- Maintainable message management

### 7. Database Architecture

**MongoDB with Mongoose:**
- Connection pooling (min: 5, max: 10 connections)
- Singleton connection pattern
- Environment-based configuration
- Schema definitions separate from models

**Connection Management:**
- `MongooseConnection` class for connection lifecycle
- Graceful shutdown handling
- Connection health checks (ping)
- Automatic reconnection handling

**Benefits:**
- Efficient connection management
- Scalable connection pooling
- Environment-specific configuration
- Robust error handling

### 8. Master Route Pattern

**app.route.ts:**
- Central route registry
- Module routes injected into master router
- Health check endpoint
- Clean route organization

**Benefits:**
- Single place to see all routes
- Easy route management
- Modular route injection
- Health monitoring

---

## Design Patterns Used

### Frontend Patterns

1. **Container/Presentational Pattern**
   - Hooks contain logic, components handle presentation
   - Clear separation of concerns

2. **Custom Hooks Pattern**
   - Reusable stateful logic
   - `useDashboardData` for data management

3. **Service Layer Pattern**
   - API abstraction layer
   - Centralized API configuration

4. **Compound Components Pattern**
   - Chart system with generic + specific components
   - Flexible component composition

5. **Progressive Enhancement**
   - Skeleton loaders
   - Incremental data display
   - Graceful degradation

### Backend Patterns

1. **MVC Pattern**
   - Model-View-Controller separation
   - Clear layer boundaries

2. **Repository Pattern**
   - Data access abstraction
   - Database-independent business logic

3. **Service Layer Pattern**
   - Business logic encapsulation
   - Reusable business rules

4. **Dependency Injection**
   - Services instantiate repositories
   - Testable components

5. **Middleware Pattern**
   - Error handling middleware
   - Request processing pipeline

6. **Singleton Pattern**
   - Database connection management
   - Single connection instance

7. **Factory Pattern**
   - Response DTO creation
   - Standardized response generation

---

## Key Architectural Decisions

### Frontend Decisions

1. **TypeScript**
   - Full type safety throughout
   - Better developer experience
   - Catch errors at compile time

2. **Vite**
   - Fast build times
   - Hot module replacement
   - Modern tooling

3. **React Hooks**
   - Modern state management
   - Reusable logic
   - Clean component code

4. **Axios**
   - HTTP client with interceptors
   - Request/response transformation
   - Error handling

5. **Recharts**
   - Data visualization library
   - Flexible chart components
   - Good TypeScript support

6. **Tailwind CSS**
   - Utility-first CSS
   - Rapid UI development
   - Consistent styling

7. **Path Aliases**
   - `@/` for `src/` directory
   - Clean imports
   - Better code organization

### Backend Decisions

1. **TypeScript**
   - Type safety
   - Better IDE support
   - Compile-time error checking

2. **Express.js**
   - Mature HTTP server framework
   - Large ecosystem
   - Flexible middleware system

3. **MongoDB with Mongoose**
   - NoSQL database for flexible schema
   - Mongoose ODM for type safety
   - Good performance for analytics

4. **Environment Variables**
   - Configuration management
   - Environment-specific settings
   - Validation on startup

5. **Modular Architecture**
   - Feature-based modules
   - Scalable structure
   - Easy to maintain

6. **Standardized Error Handling**
   - Consistent error responses
   - Proper error propagation
   - Better debugging

7. **Connection Pooling**
   - Efficient database connections
   - Better performance
   - Resource management

---

## Benefits of This Architecture

### 1. Maintainability
- Clear separation of concerns
- Easy to locate code
- Well-organized structure
- Consistent patterns

### 2. Scalability
- Modular architecture
- Easy to add new features
- Horizontal scaling support
- Performance optimizations

### 3. Testability
- Isolated layers
- Easy to mock dependencies
- Unit testable components
- Integration test support

### 4. Type Safety
- TypeScript throughout
- Compile-time error checking
- Better IDE support
- Self-documenting code

### 5. Performance
- Connection pooling
- Progressive loading
- Efficient data fetching
- Optimized builds

### 6. Developer Experience
- Clear structure
- Reusable components
- Type safety
- Good tooling support

### 7. Error Handling
- Centralized error management
- Consistent error responses
- Proper error propagation
- Better debugging

---

## File Structure Summary

### Frontend
```
frontend/src/
├── pages/              # Page components
├── components/         # Reusable components
│   ├── charts/        # Chart system
│   └── ...            # Other components
├── hooks/             # Custom React hooks
├── services/          # API service layer
└── utils/             # Utility functions
```

### Backend
```
backend/src/
├── modules/           # Feature modules
│   ├── user/         # User module
│   ├── transaction/ # Transaction module
│   └── dashboard/    # Dashboard module
├── middleware/        # Express middleware
├── utils/            # Shared utilities
├── config/           # Configuration
└── constants/        # Application constants
```

---

