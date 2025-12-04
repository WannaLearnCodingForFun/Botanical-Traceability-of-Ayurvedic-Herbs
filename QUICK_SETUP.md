# Quick Setup Checklist for New Laptop

## Pre-Setup Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Git installed (if cloning from repo)
- [ ] VS Code installed
- [ ] Modern web browser installed

## Setup Steps

1. **Copy/Clone Project**
   ```bash
   # If using Git:
   git clone <repo-url>
   cd SIH
   
   # Or copy the entire SIH folder to your laptop
   ```

2. **Open in VS Code**
   ```bash
   code .
   ```

3. **Install VS Code Extensions**
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Type: "Extensions: Show Recommended Extensions"
   - Click "Install All"

4. **Install Dependencies**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```
   
   Or manually:
   ```bash
   npm run install:all
   npm run build:all
   ```

5. **Start Application**
   ```bash
   ./start.sh
   ```
   
   Or:
   ```bash
   cd backend-api
   npm run dev
   ```

6. **Verify Installation**
   - Open http://localhost:4000/dashboard
   - Should see the dashboard without errors

## File Structure Overview

```
SIH/
├── package.json              ← Root package.json (NEW!)
├── start.sh                  ← Main startup script
├── SETUP_GUIDE.md           ← Detailed setup instructions
├── .vscode/                  ← VS Code configs (NEW!)
│   ├── extensions.json       ← Recommended extensions
│   ├── settings.json         ← Editor settings
│   └── launch.json           ← Debug configurations
├── backend-api/              ← Backend server
│   └── package.json
├── consumer-portal/          ← Consumer-facing app
│   └── package.json
├── collectors-app/          ← Collector mobile app
│   └── package.json
├── web-dashboard/           ← Stakeholder dashboard
│   └── package.json
├── fabric-logs-viewer/       ← Blockchain logs viewer
│   └── package.json
├── iot-gateway/             ← IoT/SMS gateway
│   └── package.json
└── chaincode/               ← Hyperledger Fabric chaincode
    └── package.json
```

## All Package.json Files

Each service has its own `package.json`:
- ✅ `package.json` (root) - Workspace configuration
- ✅ `backend-api/package.json` - Backend dependencies
- ✅ `consumer-portal/package.json` - Consumer portal dependencies
- ✅ `collectors-app/package.json` - Collectors app dependencies
- ✅ `web-dashboard/package.json` - Dashboard dependencies
- ✅ `fabric-logs-viewer/package.json` - Logs viewer dependencies
- ✅ `iot-gateway/package.json` - IoT gateway dependencies
- ✅ `chaincode/package.json` - Chaincode dependencies

## Common Commands

| Command | What it does |
|---------|--------------|
| `./start.sh` | Install, build, and start everything |
| `npm run install:all` | Install all dependencies |
| `npm run build:all` | Build all frontend apps |
| `cd backend-api && npm run dev` | Start backend only |
| `cd consumer-portal && npm run dev` | Start consumer portal dev server |

## Troubleshooting Quick Fixes

**Port 4000 in use:**
```bash
# Mac/Linux:
lsof -ti:4000 | xargs kill -9

# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

**Module not found:**
```bash
# Delete all node_modules
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Reinstall
npm run install:all
```

**Build errors:**
```bash
npm run build:all
```

## Need Help?

See `SETUP_GUIDE.md` for detailed troubleshooting and setup instructions.


