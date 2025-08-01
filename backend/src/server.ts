// src/server.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { startSimulation, stopSimulation, getSimulationStatus } from '../utils/simulator';
import proposalRoutes from '../endpoints/proposals';
import { connectToDatabase } from '../config/database';
import { initializeAIAgent } from '../agents/agent';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// CORS configuration
app.use(cors({
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', proposalRoutes);

// Initialize AI Agent
initializeAIAgent(io);

io.on('connection', (socket) => {
  console.log('✅ Client connected');

  // Start simulation
  socket.on('start-simulation', () => {
    console.log('🚀 Starting simulation...');
    startSimulation(socket);
  });

  socket.on('logs', () => {
    console.log('🔍 Logs received');
  })


  // Stop simulation
  socket.on('stop-simulation', () => {
    console.log('⏹️ Stopping simulation...');
    stopSimulation(socket);
  });

  // Get simulation status
  socket.on('get-simulation-status', () => {
    const status = getSimulationStatus(socket);
    socket.emit('simulation-status', status);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
    // Clean up any running simulations for this socket
    stopSimulation(socket);
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for connections`);
  console.log(`🤖 AI Agent integrated and ready`);
});




