// src/server.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { simulateRandomStream, startSimulation, stopSimulation, getSimulationStatus } from '../utils/simulator';
import { swapHbarToToken } from '../events/handleSwap';
import { loginAsAdmin, getAccessToken, getAccountSession } from '../services/authService';
import { getPolicies, getBlock, getBlockByPolicyId, mintToken, associateToken } from '../services/policyService';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.creds.dev' });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('✅ Client connected');

  // Start simulation
  socket.on('start-simulation', () => {
    console.log('🚀 Starting simulation...');
    startSimulation(socket);
  });

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
});

// Testing API Functions of Hedera Guardian
// (async () => {
//   try {
//     const refreshToken = await loginAsAdmin();
//     if (!refreshToken) throw new Error('No refresh token received from login');

//     const accessToken = await getAccessToken(refreshToken);
//     console.log('Access token:', accessToken);

//     // const session = await getAccountSession(accessToken);
//     // console.log('Account session:', session);

//     const policies = await getPolicies(accessToken);
//     console.log('Policies:', policies);

//     const blocks = await getBlockByPolicyId(accessToken, '');
//     console.log('Blocks:', blocks);

//     const payload={document:{}};

//     const blockData = await mintToken(accessToken, '', '', payload);
//     console.log('Block data:', blockData);

//     const Associateblock = await associateToken(accessToken, '', '');
//     console.log('Associateblock:', Associateblock);


//   } catch (error) {
//     console.error('Error:', error);
//   }
// })();



