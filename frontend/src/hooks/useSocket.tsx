import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'https://bionode-nodebility-backend.online/';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [simData, setSimData] = useState<any | null>(null);
  const [status, setStatus] = useState<string>('');

  const startSimulation = () => {
    if (socketRef.current) {
      socketRef.current.emit('start-simulation');
      console.log('▶️ Simulation started');
    }
  };

  const stopSimulation = () => {
    if (socketRef.current) {
      socketRef.current.emit('stop-simulation');
      console.log('⏹️ Simulation stopped');
    }
  };

  useEffect(() => {
    // Initialize socket
    const socket = io(SERVER_URL, {
      transports: ['websocket'],
    });
    socketRef.current = socket;

    // Connection established
    socket.on('connect', () => {
      console.log('✅ Connected to Biogas Simulator');
      setIsConnected(true);
    });

    // Listen for simulation data
    socket.on('biogas-data', (data) => {
      console.log('📊 Received biogas data:', data);
      setSimData(data);
    });

    // Simulation status
    socket.on('simulation-status', (statusMsg: string) => {
      console.log('📈 Simulation status:', statusMsg);
      setStatus(statusMsg);
    });

    // Use-case switch
    socket.on('use-case-switch', (info: any) => {
      console.log('🔄 Use case switched:', info);
    });

    // Simulation stopped
    socket.on('simulation-stopped', (message: any) => {
      console.log('⏹️ Simulation stopped:', message);
      setStatus('Stopped');
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      console.log('❌ Disconnected from Biogas Simulator');
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return {
    isConnected,
    simData,
    status,
    startSimulation,
    stopSimulation,
  };
};
