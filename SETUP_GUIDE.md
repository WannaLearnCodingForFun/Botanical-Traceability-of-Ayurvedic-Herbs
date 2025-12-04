# Complete Setup Guide for New Laptop

## Prerequisites

Before you start, ensure you have the following installed:

### Required Software

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` (should show v18.x.x or higher)
   - Verify npm: `npm --version` (should show 9.x.x or higher)

2. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/
   - Verify: `git --version`

3. **VS Code** (recommended IDE)
   - Download from: https://code.visualstudio.com/
   - Install recommended extensions (see `.vscode/extensions.json`)

### Optional but Recommended

- **Postman** or **Thunder Client** (for API testing)
- **Modern Web Browser** (Chrome, Firefox, Edge) with geolocation support

---

## Step-by-Step Setup

### Step 1: Clone or Copy the Project

If using Git:
```bash
git clone <repository-url>
cd SIH
```

Or simply copy the entire `SIH` folder to your new laptop.

### Step 2: Open in VS Code

```bash
code .
```

Or open VS Code and use File > Open Folder to select the `SIH` directory.

### Step 3: Install Dependencies

**Option A: Using the setup script (Recommended)**
```bash
chmod +x start.sh
./start.sh
```
This will automatically install all dependencies and build everything.

**Option B: Manual installation**
```bash
# Install dependencies for each service
cd backend-api && npm install && cd ..
cd consumer-portal && npm install && cd ..
cd collectors-app && npm install && cd ..
cd web-dashboard && npm install && cd ..
cd fabric-logs-viewer && npm install && cd ..
cd iot-gateway && npm install && cd ..
cd chaincode && npm install && cd ..
```

**Option C: Using root package.json**
```bash
npm run install:all
```

### Step 4: Build Frontend Applications

```bash
npm run build:all
```

Or manually:
```bash
cd consumer-portal && npm run build && cd ..
cd collectors-app && npm run build && cd ..
cd web-dashboard && npm run build && cd ..
cd fabric-logs-viewer && npm run build && cd ..
```

### Step 5: Start the Application

```bash
./start.sh
```

Or manually:
```bash
cd backend-api
npm run dev
```

### Step 6: Access the Application

Open your browser and navigate to:
- **Dashboard**: http://localhost:4000/dashboard
- **Consumer Portal**: http://localhost:4000/consumer
- **Collectors App**: http://localhost:4000/collectors
- **Fabric Logs**: http://localhost:4000/logs
- **API**: http://localhost:4000/api

---

## Project Structure

```
SIH/
├── backend-api/          # Node.js/Express backend server
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── adapters/     # Data adapters (memory/Fabric)
│   │   └── models/       # Data models
│   └── package.json
│
├── consumer-portal/       # React consumer-facing app
│   ├── src/
│   └── package.json
│
├── collectors-app/        # React mobile-friendly collector app
│   ├── src/
│   └── package.json
│
├── web-dashboard/         # React stakeholder dashboard
│   ├── src/
│   └── package.json
│
├── fabric-logs-viewer/    # React blockchain logs viewer
│   ├── src/
│   └── package.json
│
├── iot-gateway/          # IoT/SMS gateway service
│   ├── src/
│   └── package.json
│
├── chaincode/            # Hyperledger Fabric chaincode
│   ├── src/
│   └── package.json
│
├── blockchain-network/   # Fabric network configs
│   └── docker-compose.yaml
│
├── start.sh              # Startup script
├── package.json          # Root package.json
└── README.md            # Project documentation
```

---

## VS Code Setup

### Recommended Extensions

The `.vscode/extensions.json` file contains recommended extensions. Install them:

1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Extensions: Show Recommended Extensions"
4. Click "Install All"

Or manually install:
- **ES7+ React/Redux/React-Native snippets**
- **TypeScript and JavaScript Language Features** (built-in)
- **Prettier - Code formatter**
- **ESLint**

### VS Code Settings

The `.vscode/settings.json` file contains recommended settings for:
- Auto-formatting on save
- TypeScript preferences
- File exclusions

---

## Troubleshooting

### Port Already in Use

If port 4000 is already in use:

**On Mac/Linux:**
```bash
lsof -ti:4000 | xargs kill -9
```

**On Windows:**
```bash
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

Or change the port in `backend-api/src/index.ts`:
```typescript
const PORT = process.env.PORT || 4001; // Change to 4001
```

### Node Version Issues

If you get errors about Node version:

1. Install Node Version Manager (nvm):
   - Mac/Linux: https://github.com/nvm-sh/nvm
   - Windows: https://github.com/coreybutler/nvm-windows

2. Install Node 18:
```bash
nvm install 18
nvm use 18
```

### Module Not Found Errors

If you see "Cannot find module" errors:

1. Delete all `node_modules` folders:
```bash
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
```

2. Delete all `package-lock.json` files:
```bash
find . -name "package-lock.json" -delete
```

3. Reinstall:
```bash
npm run install:all
```

### Build Errors

If frontend builds fail:

1. Clear build cache:
```bash
cd consumer-portal && rm -rf node_modules dist && npm install && cd ..
cd collectors-app && rm -rf node_modules dist && npm install && cd ..
cd web-dashboard && rm -rf node_modules dist && npm install && cd ..
cd fabric-logs-viewer && rm -rf node_modules dist && npm install && cd ..
```

2. Rebuild:
```bash
npm run build:all
```

### Permission Denied (start.sh)

**On Mac/Linux:**
```bash
chmod +x start.sh
```

**On Windows:**
Use Git Bash or WSL, or run commands manually.

---

## Development Workflow

### Running Individual Services

For development with hot reload:

**Terminal 1 - Backend:**
```bash
cd backend-api
npm run dev
```

**Terminal 2 - Consumer Portal:**
```bash
cd consumer-portal
npm run dev
```

**Terminal 3 - Collectors App:**
```bash
cd collectors-app
npm run dev
```

**Terminal 4 - Dashboard:**
```bash
cd web-dashboard
npm run dev
```

### Making Changes

1. **Backend Changes**: Edit files in `backend-api/src/`
   - Changes require server restart (Ctrl+C and `npm run dev`)

2. **Frontend Changes**: Edit files in `*/src/` directories
   - Changes auto-reload in dev mode
   - Rebuild for production: `npm run build` in each frontend directory

### Testing API Endpoints

Use Postman, Thunder Client, or curl:

```bash
# Health check
curl http://localhost:4000/health

# Create collection event
curl -X POST http://localhost:4000/api/collection \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "TEST-001",
    "species": "Ashwagandha",
    "collectorId": "collector-001",
    "gps": {"lat": 20.5937, "lng": 78.9629},
    "timestamp": "2024-01-15T10:00:00Z"
  }'

# Get provenance
curl http://localhost:4000/api/provenance/TEST-001
```

---

## Environment Variables

Create a `.env` file in `backend-api/` if needed:

```env
PORT=4000
NODE_ENV=development
```

---

## Production Deployment

For production:

1. Build all frontends:
```bash
npm run build:all
```

2. Build backend:
```bash
cd backend-api
npm run build
```

3. Start production server:
```bash
cd backend-api
npm start
```

Or use PM2:
```bash
npm install -g pm2
cd backend-api
pm2 start dist/index.js --name traceability-api
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `./start.sh` | Install, build, and start everything |
| `npm run install:all` | Install all dependencies |
| `npm run build:all` | Build all frontend apps |
| `cd backend-api && npm run dev` | Start backend only |
| `cd consumer-portal && npm run dev` | Start consumer portal dev server |

---

## Support

If you encounter issues:

1. Check Node.js version: `node --version` (must be >= 18)
2. Check npm version: `npm --version` (must be >= 9)
3. Clear node_modules and reinstall
4. Check port 4000 is available
5. Check browser console for errors
6. Check backend terminal for error messages

---

## Next Steps

After setup:
1. Read `README.md` for project overview
2. Check `QUICKSTART.md` for quick start guide
3. Explore the codebase starting with `backend-api/src/index.ts`
4. Test the system by creating collection events in Collectors app

Good luck! 🚀

