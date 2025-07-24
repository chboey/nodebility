// src/server.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { simulateRandomStream } from '../utils/simulator';
import { swapHbarToToken } from '../events/handleSwap';

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

  socket.on('simulate-random', () => {
    simulateRandomStream(socket);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});



// Testing API Functions of Hedera Guardian
(async () => {
  try {
    const refreshToken = await loginAsAdmin();
    if (!refreshToken) throw new Error('No refresh token received from login');

    const accessToken = await getAccessToken(refreshToken);
    console.log('Access token:', accessToken);

    const session = await getAccountSession(accessToken);
   console.log('Account session:', session);

    const policies = await getPolicies(accessToken);
    console.log('Policies:', policies);

    const blocks = await getBlockByPolicyId(accessToken, '');
    console.log('Blocks:', blocks);

    //Function to go down the hierarchy of blocks
    const block = await getBlock(accessToken, '', '');
    console.log('Block:', block);

    const payload={document:{}};

    const blockData = await postBlockData(accessToken, '', '', payload);
    console.log('Block data:', blockData);

    const profile = await getProfile(accessToken, "");
    console.log('Profile:', profile);

    const Associateblock = await triggerBlock(accessToken, '', '');
    console.log('Associateblock:', Associateblock);


  } catch (error) {
    console.error('Error:', error);
  }
})();



