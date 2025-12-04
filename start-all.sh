#!/bin/bash

echo "🚀 Starting Ayurvedic Traceability System..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be >= 18. Current: $(node -v)"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID $CONSUMER_PID $COLLECTORS_PID $DASHBOARD_PID $IOT_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Backend API
echo "📦 Installing backend-api dependencies..."
cd backend-api
if [ ! -d "node_modules" ]; then
    npm install
fi
echo "🔧 Starting Backend API on port 4000..."
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Consumer Portal
echo "📦 Installing consumer-portal dependencies..."
cd consumer-portal
if [ ! -d "node_modules" ]; then
    npm install
fi
echo "🌐 Starting Consumer Portal on port 5173..."
npm run dev > ../consumer.log 2>&1 &
CONSUMER_PID=$!
cd ..

# Start Collectors App
echo "📦 Installing collectors-app dependencies..."
cd collectors-app
if [ ! -d "node_modules" ]; then
    npm install
fi
echo "📱 Starting Collectors App on port 5174..."
npm run dev > ../collectors.log 2>&1 &
COLLECTORS_PID=$!
cd ..

# Start Web Dashboard
echo "📦 Installing web-dashboard dependencies..."
cd web-dashboard
if [ ! -d "node_modules" ]; then
    npm install
fi
echo "📊 Starting Web Dashboard on port 5175..."
npm run dev > ../dashboard.log 2>&1 &
DASHBOARD_PID=$!
cd ..

# Start IoT Gateway (optional)
echo "📦 Installing iot-gateway dependencies..."
cd iot-gateway
if [ ! -d "node_modules" ]; then
    npm install
fi
echo "🔌 Starting IoT Gateway on port 4010..."
npm run dev > ../iot.log 2>&1 &
IOT_PID=$!
cd ..

sleep 2

echo ""
echo "✅ All services started successfully!"
echo ""
echo "📍 Service URLs:"
echo "   Backend API:     http://localhost:4000"
echo "   Consumer Portal: http://localhost:5173"
echo "   Collectors App:  http://localhost:5174"
echo "   Web Dashboard:   http://localhost:5175"
echo "   IoT Gateway:     http://localhost:4010"
echo ""
echo "📝 Logs are saved in:"
echo "   - backend.log"
echo "   - consumer.log"
echo "   - collectors.log"
echo "   - dashboard.log"
echo "   - iot.log"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for all processes
wait

