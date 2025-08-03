// src/simulator.ts
import { analyzeMintData } from "../agents/agent";
import { analyzeStreamData } from "../agents/agent";
let biogasDataStream: SimData[] = [];
let currentSimData: SimData | null = null;
let hasMadeProposal = false;
let scenarioEvents: any[] = [];
let lastAnalysisTime = 0;
const PROPOSAL_INTERVAL = 10;

export interface SimData {
  wasteInput: number;
  methaneGenerated: number;
  electricityOutput: number;
}

interface PlantState {
  wasteInput: number;
  methaneGenerated: number;
  electricityOutput: number;
}

// Base plant configuration
const PLANT_CONFIG = {
  wasteToMethaneRatio: 0.15,   // Typical waste to methane conversion ratio
  methaneToElectricityRatio: 0.4, // Conversion ratio from methane to electricity
};


// Use Case 1: Optimal operation
function useCase1(counter: number, total: number): PlantState {
  const wasteInput = 60 + Math.sin(counter * 0.1) * 5 + (Math.random() - 0.5) * 3;
  const methaneGenerated = wasteInput * PLANT_CONFIG.wasteToMethaneRatio * 1.2; // 20% boost
  const electricityOutput = methaneGenerated * PLANT_CONFIG.methaneToElectricityRatio; // Just this tick's generation

  return {
    wasteInput: Math.max(0, wasteInput),
    methaneGenerated: Math.max(0, methaneGenerated),
    electricityOutput: Math.max(0, electricityOutput)
  };
}

// Use Case 2: Suboptimal operation
function useCase2(counter: number, total: number): PlantState {
  const wasteInput = 70 + Math.sin(counter * 0.15) * 8 + (Math.random() - 0.5) * 5;
  const methaneGenerated = wasteInput * PLANT_CONFIG.wasteToMethaneRatio * 0.8; // 20% reduction
  const electricityOutput = methaneGenerated * PLANT_CONFIG.methaneToElectricityRatio * 0.9; // Just this tick's generation

  return {
    wasteInput: Math.max(0, wasteInput),
    methaneGenerated: Math.max(0, methaneGenerated),
    electricityOutput: Math.max(0, electricityOutput)
  };
}

const useCases = [useCase1, useCase2];

function injectScenarios(counter: number, state: PlantState, socket: any): PlantState {
  // 1. Waste spike
  if (counter % 20 === 0) {
    state.wasteInput *= 2.5;
  }

  // 2. Random methane drop
  if (Math.random() < 0.12) {
    const original = state.methaneGenerated;
    state.methaneGenerated *= 0.6;
  }

  // 3. Seasonal waste drop
  if (counter % 100 > 60 && counter % 100 < 90) {
    state.wasteInput *= 0.4;
  }

  // 4. Random power surge
  if (Math.random() < 0.05) {
    const original = state.electricityOutput;
    state.electricityOutput *= 1.5;
  }

  return state;
}

const activeIntervals = new Map<any, NodeJS.Timeout>();
const simulationStatus = new Map<any, boolean>();

export function startSimulation(socket: any) {
  if (simulationStatus.get(socket)) {
    socket.emit('simulation-status', { 
      status: 'error', 
      message: 'Simulation is already running' 
    });
    return;
  }

  let counter = 0;
  let totalElectricity = 0;
  let currentUseCaseIndex = 0;

  console.log('🚀 Simulation started');

  const interval = setInterval(() => {
    counter++;

    const generator = useCases[currentUseCaseIndex];
    let result: PlantState = generator(counter, totalElectricity);

    result = injectScenarios(counter, result, socket);
    
    // Add this tick's generation to the total
    totalElectricity += result.electricityOutput;

    if (totalElectricity >= 100) {
      const previousValue = totalElectricity;
      totalElectricity = totalElectricity - 100;
      const msg = `🪙 Mint event: reached 100 kWh, continuing from ${totalElectricity.toFixed(2)}`;
      analyzeMintData(result);
    } 

    const data: SimData = {
      wasteInput: result.wasteInput,
      methaneGenerated: result.methaneGenerated,
      electricityOutput: totalElectricity,
    };

    socket.emit('biogas-data', data);

    biogasDataStream.push(data);
    currentSimData = data; // Track current simulator data

    socket.on('scenario-event', (event: any) => {
      scenarioEvents.push(event);
      
      // Keep only last 20 scenario events
      if (scenarioEvents.length > 20) {
        scenarioEvents = scenarioEvents.slice(-20);
      }
      
    });
      
    // Keep only last 100 data points to avoid memory issues
    if (biogasDataStream.length > 100) {
        biogasDataStream = biogasDataStream.slice(-100);
    }
      
      // Reset proposal flag at the start of each 100-point cycle
    if (biogasDataStream.length % PROPOSAL_INTERVAL === 0 && hasMadeProposal) {
        hasMadeProposal = false;
    }
      
      // Analyze every 100 data points for proposals
    if (counter % 10 === 0) {
        analyzeStreamData(biogasDataStream, scenarioEvents, hasMadeProposal);
    }

    // Switch to next use case every 20 ticks
    if (counter % 30 === 0) {
      currentUseCaseIndex = (currentUseCaseIndex + 1) % useCases.length;
      socket.emit('use-case-switch', { useCase: currentUseCaseIndex + 1, counter });
      socket.emit('scenario-event', { type: 'use-case-switch', counter });
    }
  }, 1000);

  activeIntervals.set(socket, interval);
  simulationStatus.set(socket, true);
  
  socket.emit('simulation-status', { 
    status: 'started', 
    message: 'Simulation started successfully' 
  });
}

export function stopSimulation(socket: any) {
  const interval = activeIntervals.get(socket);
  if (interval) {
    clearInterval(interval);
    activeIntervals.delete(socket);
    simulationStatus.set(socket, false);
    socket.emit('logs', {
      type: 'simulation-stopped',
      message: 'Simulation stopped by user',
      timestamp: new Date().toISOString()
    });
  } else {
    socket.emit('logs', { 
      type: 'simulation-error', 
      message: 'No active simulation found',
      timestamp: new Date().toISOString()
    });
  }
}

export function getSimulationStatus(socket: any) {
  const isRunning = simulationStatus.get(socket) || false;
  return {
    isRunning,
    hasActiveInterval: activeIntervals.has(socket)
  };
}

export function simulateRandomStream(socket: any) {
  startSimulation(socket);
}