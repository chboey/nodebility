import io from 'socket.io-client';
import { getSimulationStatus, SimData, startSimulation, stopSimulation } from '../utils/simulator';

export const socket = io('http://localhost:4000');

socket.on('connect', () => {
  socket.emit('start-simulation');
});

socket.on('start-simulation', () => {
  console.log('🚀 Starting simulation');
  startSimulation(socket);
});
