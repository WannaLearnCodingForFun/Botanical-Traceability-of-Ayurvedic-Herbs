# All services unified on port 4000

## Quick Start (Single Port)

```bash
./start.sh
```

This will:
1. Install all dependencies
2. Build all frontend apps
3. Start the unified server on port 4000

## URLs (All on Port 4000)

- **Dashboard**: http://localhost:4000/dashboard
- **Consumer Portal**: http://localhost:4000/consumer
- **Collectors App**: http://localhost:4000/collectors
- **API**: http://localhost:4000/api
- **Root**: http://localhost:4000 (redirects to dashboard)

## Manual Setup

### 1. Install dependencies
```bash
cd consumer-portal && npm install && cd ..
cd collectors-app && npm install && cd ..
cd web-dashboard && npm install && cd ..
cd backend-api && npm install && cd ..
```

### 2. Build frontends
```bash
cd consumer-portal && npm run build && cd ..
cd collectors-app && npm run build && cd ..
cd web-dashboard && npm run build && cd ..
```

### 3. Start server
```bash
cd backend-api
npm run dev
```

All services will be available on port 4000!

## Development Mode

For development with hot reload, you can still run each service separately:

```bash
# Terminal 1: Backend API
cd backend-api && npm run dev

# Terminal 2: Consumer Portal (dev mode)
cd consumer-portal && npm run dev

# Terminal 3: Collectors App (dev mode)
cd collectors-app && npm run dev

# Terminal 4: Dashboard (dev mode)
cd web-dashboard && npm run dev
```

But for production/testing, use the unified `./start.sh` script.

