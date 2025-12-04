#!/bin/bash

echo "Starting Unified Ayurvedic Traceability System..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js >= 18"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "ERROR: Node.js version must be >= 18. Current: $(node -v)"
    exit 1
fi

# Install dependencies for all frontends if needed
echo "Installing dependencies..."

if [ ! -d "consumer-portal/node_modules" ]; then
    echo "  Installing consumer-portal..."
    cd consumer-portal && npm install && cd ..
fi

if [ ! -d "collectors-app/node_modules" ]; then
    echo "  Installing collectors-app..."
    cd collectors-app && npm install && cd ..
fi

if [ ! -d "web-dashboard/node_modules" ]; then
    echo "  Installing web-dashboard..."
    cd web-dashboard && npm install && cd ..
fi

if [ ! -d "backend-api/node_modules" ]; then
    echo "  Installing backend-api..."
    cd backend-api && npm install && cd ..
fi

# Build frontends
echo ""
echo "Building frontend applications..."
cd consumer-portal && npm run build && cd ..
cd collectors-app && npm run build && cd ..
cd web-dashboard && npm run build && cd ..

if [ ! -d "fabric-logs-viewer/node_modules" ]; then
    echo "  Installing fabric-logs-viewer..."
    cd fabric-logs-viewer && npm install && cd ..
fi
cd fabric-logs-viewer && npm run build && cd ..

echo ""
echo "Build complete!"
echo ""

# Start backend (which serves everything)
cd backend-api
echo "Starting unified server on port 4000..."
echo ""
npm run dev

