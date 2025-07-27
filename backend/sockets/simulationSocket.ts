import io from 'socket.io-client';
import { getSimulationStatus, SimData, startSimulation, stopSimulation } from '../utils/simulator';

export const socket = io('http://localhost:4000');

socket.on('connect', () => {
  socket.emit('start-simulation');
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
socket.on('simulation-stopped', (message: any) => {
  console.log('⏹️ Simulation stopped:', message);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from Biogas Simulator');
});