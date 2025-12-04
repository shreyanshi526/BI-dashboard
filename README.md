# TDK Business Intelligence Dashboard

A full-stack business intelligence dashboard for analyzing AI model usage, costs, and user analytics.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **Docker** and **Docker Compose** (for containerized deployment)
- **MongoDB** connection string (MongoDB Atlas or local instance)

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tdk-bi-dashboard
   ```

2. **Set up environment variables**
   
   Create `backend/.env` file:
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `backend/.env` with your configuration:
   ```env
   PORT=3001
   MONGODB_URI=mongodb+srv://your-connection-string
   MONGODB_DB_NAME=tdk_dashboard
   NODE_ENV=production
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/api/health

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your MongoDB connection string and configuration.

4. **Build TypeScript**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Production
   npm start
   
   # Development (with hot reload)
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001 (configured via Vite proxy)

## 📁 Project Structure

```
tdk-bi-dashboard/
├── backend/                 # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── modules/        # MVC modules (user, transaction, dashboard)
│   │   ├── utils/          # Utilities (mongoose, env validation, etc.)
│   │   ├── middleware/     # Error handling middleware
│   │   ├── constants/      # Application constants
│   │   ├── app.route.ts    # Main route file
│   │   └── index.ts        # Entry point
│   ├── .env.example        # Environment variables template
│   ├── Dockerfile          # Backend Docker image
│   └── package.json
│
├── frontend/               # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── pages/          # Page components (Dashboard)
│   │   ├── components/     # Reusable components
│   │   │   ├── charts/    # Chart components (generic + dashboard-specific)
│   │   │   └── ...
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Root component
│   ├── Dockerfile          # Frontend Docker image
│   └── package.json
│
├── docker-compose.yml      # Docker Compose configuration
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `3001` |
| `MONGODB_URI` | MongoDB connection string | **Yes** | - |
| `MONGODB_DB_NAME` | Database name | No | `tdk_dashboard` |
| `NODE_ENV` | Environment (development/production) | No | `development` |

### Frontend

Frontend uses Vite proxy configuration. No environment variables needed for local development.

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up -d

# Rebuild and start (use after code/config changes)
docker-compose up -d --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
docker-compose up -d backend
docker-compose up -d frontend
```

### When to Rebuild Docker Images

Rebuild Docker images when you:
- **Change source code** (TypeScript/React files)
- **Update configuration files** (`tsconfig.json`, `vite.config.ts`, `package.json`)
- **Modify Dockerfile** or `docker-compose.yml`
- **Update dependencies** (after `npm install`)

**Quick rebuild command:**
```bash
# Rebuild everything and restart
docker-compose up -d --build
```

**Rebuild without cache (clean build):**
```bash
docker-compose build --no-cache
docker-compose up -d
```

