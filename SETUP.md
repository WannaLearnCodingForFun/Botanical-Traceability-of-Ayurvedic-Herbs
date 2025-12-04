# Setup & Run Guide

## Prerequisites

- **Node.js** >= 18.x (check with `node --version`)
- **npm** (comes with Node.js, check with `npm --version`)
- Modern web browser with geolocation support

## Quick Start (All Services)

### Option 1: Manual Setup (Recommended for first time)

#### Step 1: Install Backend API
```bash
cd backend-api
npm install
npm run dev
```
**Backend runs on:** http://localhost:4000

Keep this terminal open and open a new terminal for the next step.

#### Step 2: Install Consumer Portal
```bash
cd consumer-portal
npm install
npm run dev
```
**Consumer Portal runs on:** http://localhost:5173

#### Step 3: Install Collectors App
```bash
cd collectors-app
npm install
npm run dev
```
**Collectors App runs on:** http://localhost:5174

#### Step 4: Install Web Dashboard (Optional)
```bash
cd web-dashboard
npm install
npm run dev
```
**Dashboard runs on:** http://localhost:5175

#### Step 5: Install IoT Gateway (Optional)
```bash
cd iot-gateway
npm install
npm run dev
```
**IoT Gateway runs on:** http://localhost:4010

---

### Option 2: One-Command Setup Script

Create a file `start-all.sh` in the root directory:

```bash
#!/bin/bash
# Start all services

# Backend API
cd backend-api && npm install && npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Consumer Portal
cd ../consumer-portal && npm install && npm run dev &
CONSUMER_PID=$!

# Collectors App
cd ../collectors-app && npm install && npm run dev &
COLLECTORS_PID=$!

# Web Dashboard
cd ../web-dashboard && npm install && npm run dev &
DASHBOARD_PID=$!

echo "All services started!"
echo "Backend API: http://localhost:4000"
echo "Consumer Portal: http://localhost:5173"
echo "Collectors App: http://localhost:5174"
echo "Dashboard: http://localhost:5175"
echo ""
echo "Press Ctrl+C to stop all services"

wait
```

Make it executable and run:
```bash
chmod +x start-all.sh
./start-all.sh
```

---

## Testing the System

### Demo Flow:

1. **Start Backend API** (required first)
   ```bash
   cd backend-api && npm install && npm run dev
   ```

2. **Open Collectors App** (http://localhost:5174)
   - Fill in the form with collection details
   - Click "Submit" to record a collection event
   - Default values are pre-filled for quick testing

3. **Add Processing Step** (via API or Postman)
   ```bash
   curl -X POST http://localhost:4000/api/processing \
     -H "Content-Type: application/json" \
     -d '{
       "batchId": "ASHWA-001",
       "stepType": "DRYING",
       "facilityId": "facility-001",
       "timestamp": "2024-01-15T10:00:00Z"
     }'
   ```

4. **Add Quality Test** (via API or Postman)
   ```bash
   curl -X POST http://localhost:4000/api/quality \
     -H "Content-Type: application/json" \
     -d '{
       "batchId": "ASHWA-001",
       "labId": "lab-001",
       "timestamp": "2024-01-16T10:00:00Z",
       "tests": {
         "moisturePercent": 8.5,
         "pesticidePpm": 0.005,
         "dnaAuthenticated": true
       }
     }'
   ```

5. **View Provenance** (Consumer Portal)
   - Open http://localhost:5173
   - Enter batch ID: `ASHWA-001`
   - Click "Lookup"
   - See map, compliance status, and full provenance chain

6. **View QR Code**
   - Open http://localhost:4000/api/qrcode/batch/ASHWA-001.png
   - Scan with any QR scanner
   - QR contains: `{"t":"batch","batchId":"ASHWA-001"}`
   - Consumer portal accepts `?batchId=ASHWA-001` in URL

---

## API Endpoints

All endpoints are prefixed with `/api`:

### Collection Events
- `POST /api/collection` - Record a new collection event
- Body: `{ batchId, species, collectorId, gps: {lat, lng}, timestamp, initialQuality?, media? }`

### Processing Steps
- `POST /api/processing` - Record a processing step
- Body: `{ batchId, stepType, facilityId, timestamp, parameters? }`

### Quality Tests
- `POST /api/quality` - Record a quality test
- Body: `{ batchId, labId, timestamp, tests: {...}, certificateUrl? }`

### Provenance
- `GET /api/provenance/:batchId` - Get full provenance for a batch

### QR Codes
- `GET /api/qrcode/batch/:batchId.png` - Generate QR code image

---

## Troubleshooting

### Port Already in Use
If you get "port already in use" errors:
- Check what's running: `lsof -i :4000` (or other port)
- Kill the process or change ports in config files

### CORS Errors
- Make sure backend API is running first
- Check that frontend apps are using the proxy (configured in vite.config.ts)

### Geolocation Not Working
- Grant browser permission for location access
- Test on HTTPS or localhost (required for geolocation API)

### Module Not Found Errors
- Run `npm install` in each directory
- Make sure you're using Node.js >= 18

### Frontend Won't Connect to Backend
- Verify backend is running on port 4000
- Check browser console for errors
- Verify proxy settings in `vite.config.ts` files

---

## Architecture

```
┌─────────────────┐
│  Collectors App │───┐
│   (Port 5174)   │   │
└─────────────────┘   │
                       │
┌─────────────────┐   │
│ Consumer Portal │───┼──► Backend API ◄─── IoT Gateway
│   (Port 5173)   │   │    (Port 4000)     (Port 4010)
└─────────────────┘   │
                       │
┌─────────────────┐   │
│ Web Dashboard   │───┘
│   (Port 5175)   │
└─────────────────┘
```

Backend API uses in-memory storage by default (no database needed for demo).

---

## Next Steps

- **Connect to Hyperledger Fabric**: See `blockchain-network/README.md`
- **Add Authentication**: Implement user auth in backend
- **Add Database**: Replace in-memory adapter with MongoDB/PostgreSQL
- **Deploy**: Use Docker Compose or cloud services

---

## Support

Check the main `README.md` for architecture details and feature descriptions.

