import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface LogEntry {
  timestamp: string;
  type: string;
  message: string;
  data?: {
    confidence: number;
    remarks: string;
  };
}

const SERVER_URL = 'https://bionode-nodebility-backend.online/';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [simData, setSimData] = useState<any | null>(null);
  const [logsData, setLogsData] = useState<LogEntry[]>([]);
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
    console.log('📊 logsData state updated:', logsData);
    console.log('📊 Current length:', logsData.length);
  }, [logsData]);

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

    socket.on('logs', (log) => {
      console.log('🔍 Received log:', log);
      const newLog: LogEntry = {
        type: log.type,
        timestamp: log.timestamp,
        message: log.message,
      };
      setLogsData((prev) => [...prev, newLog]);
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
    logsData,
    status,
    startSimulation,
    stopSimulation,
  };
};
