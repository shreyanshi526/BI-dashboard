# TDK Business Intelligence Dashboard

A full-stack business intelligence dashboard for analyzing AI model usage, costs, and user analytics.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **Docker** and **Docker Compose** (for containerized deployment)
- **MongoDB** (included as Docker service, or provide connection string for external MongoDB)

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tdk-bi-dashboard
   ```

2. **Set up environment variables (Optional)**
   
   Create `backend/.env` file:
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   **For Docker MongoDB (default):**
   - Leave `MONGODB_URI` empty or comment it out
   - The application will automatically use `mongodb://mongodb:27017/tdk_dashboard`
   
   **For External MongoDB (e.g., MongoDB Atlas):**
   ```env
   PORT=3001
   MONGODB_URI=mongodb+srv://your-connection-string
   NODE_ENV=production
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```
   
   This will start:
   - **MongoDB** service (port 27017)
   - **Backend** service (port 3001)
   - **Frontend** service (port 8080)
   - **Data Importer** service (runs once to import CSV data if available)

4. **Import CSV data (if needed)**
   
   The `data-importer` service runs automatically on startup. To manually import:
   ```bash
   # Place CSV files in "TDK Case Study Data" folder at project root
   docker-compose run --rm data-importer
   ```
   
   Or use the API endpoints (see Data Import section below).

5. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/api/health
   - MongoDB: localhost:27017 (if using Docker MongoDB)

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

5. **Import CSV data (optional)**
   ```bash
   # Place CSV files in "TDK Case Study Data" folder at project root
   npm run import-data
   ```

6. **Start the server**
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
| `MONGODB_URI` | MongoDB connection string | **No** | `mongodb://mongodb:27017/tdk_dashboard` (Docker) |
| `NODE_ENV` | Environment (development/production) | No | `development` |

**Note:** If `MONGODB_URI` is not set, the application will use the Docker MongoDB service automatically.

### Frontend

Frontend uses Vite proxy configuration. No environment variables needed for local development.

## 📥 Data Import

### CSV File Import

The application supports importing data from CSV files. You can import data in two ways:

#### Option 1: Command Line Script

1. **Place CSV files** in the `TDK Case Study Data` folder at the project root:
   ```
   TDK Case Study Data/
   ├── users.csv
   └── transactions.csv
   ```

2. **Run the import script:**
   ```bash
   cd backend
   npm run import-data
   ```

#### Option 2: API Endpoints

Upload CSV files via API endpoints:

**Import Users:**
```bash
curl -X POST http://localhost:3001/api/import/users \
  -F "users=@path/to/users.csv"
```

**Import Transactions:**
```bash
curl -X POST http://localhost:3001/api/import/transactions \
  -F "transactions=@path/to/transactions.csv"
```

**Import Both:**
```bash
curl -X POST http://localhost:3001/api/import/all \
  -F "users=@path/to/users.csv" \
  -F "transactions=@path/to/transactions.csv"
```

### CSV File Format

**users.csv** should have columns:
- `User_ID`, `User_Name`, `Region`, `Is_Active_Sub`, `Signup_Date`, `Department`, `Company_Name`

**transactions.csv** should have columns:
- `RowId`, `User_ID`, `Model_Name`, `Conversation_ID`, `Token_Type`, `Token_Count`, `Rate_Per_1k`, `Calculated_Cost`, `Timestamp`

**Note:** 
- The import process uses upsert (update or insert), so running the import multiple times will update existing records.
- API uploads use memory storage (no file system writes) for Docker compatibility.
- The `data-importer` Docker service runs automatically on startup if CSV files are mounted.

## 🐳 Docker Commands

```bash
# Build and start all services (MongoDB, Backend, Frontend, Data Importer)
docker-compose up -d

# Rebuild and start (use after code/config changes)
docker-compose up -d --build

# Start only specific services
docker-compose up -d mongodb backend frontend

# Run data import manually
docker-compose run --rm data-importer

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

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Data Import
- `POST /api/import/users` - Import users from CSV file (multipart/form-data, field: `users`)
- `POST /api/import/transactions` - Import transactions from CSV file (multipart/form-data, field: `transactions`)
- `POST /api/import/all` - Import both users and transactions (multipart/form-data, fields: `users`, `transactions`)

### Dashboard
- `GET /api/dashboard/summary` - Dashboard summary (KPIs)
- `GET /api/dashboard/cost-by-model` - Cost breakdown by AI model
- `GET /api/dashboard/daily-trends` - Daily cost trends
- `GET /api/dashboard/monthly-trends` - Monthly trends
- `GET /api/dashboard/token-distribution` - Token distribution (prompt vs completion)
- `GET /api/dashboard/top-users` - Top users by spending
- `GET /api/dashboard/regions` - Available regions
- `GET /api/dashboard/date-range` - Available date range

### Query Parameters

Most dashboard endpoints support filtering:
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `region` - Filter by region
- `limit` - Limit results (for top-users)

Example:
```
GET /api/dashboard/summary?startDate=2024-01-01&endDate=2024-12-31&region=US
```

