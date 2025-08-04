// src/server.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SimData, startSimulation, stopSimulation } from '../utils/simulator';
import proposalRoutes from '../endpoints/proposals';
import votingRoutes from '../endpoints/voting';

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
app.use('/api', votingRoutes);

io.on('connection', (socket) => {
  console.log('✅ Client connected');

  socket.on('start-simulation', () => {
    console.log('▶️ Start simulation requested by Client');
    startSimulation(socket);
  });

  socket.on('logs', (logs: any) => {
    console.log('🔍 Logs: ', logs);
  });

  // Listen for simulation data
  socket.on('biogas-data', (data: SimData) => {
    console.log('📊 Received biogas data:', data);
  });
  
  // Listen for simulation status updates
  socket.on('simulation-status', (status: any) => {
    console.log('📈 Simulation status:', status);
  });
  
  // Listen for use case switches
  socket.on('use-case-switch', (info: any) => {
    console.log('🔄 Use case switched:', info);
  });
  
  // Listen for simulation stopped
  socket.on('stop-simulation', (message: any) => {
    console.log('⏹️ Simulation stopped by Client');
    stopSimulation(socket);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Disconnected from Biogas Simulator');
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for connections`);
  console.log(`🤖 AI Agent integrated and ready`);
});