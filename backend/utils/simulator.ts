// src/simulator.ts

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
    const msg = `⚠️ Waste surge detected at tick ${counter}: wasteInput increased to ${state.wasteInput.toFixed(2)}`;
    socket.emit('scenario-event', { type: 'waste-surge', message: msg, counter });
  }

  // 2. Random methane drop
  if (Math.random() < 0.12) {
    const original = state.methaneGenerated;
    state.methaneGenerated *= 0.6;
    const msg = `⚠️ Methane efficiency drop: from ${original.toFixed(2)} to ${state.methaneGenerated.toFixed(2)}`;
    socket.emit('scenario-event', { type: 'methane-drop', message: msg, counter });
  }

  // 3. Seasonal waste drop
  if (counter % 100 > 60 && counter % 100 < 90) {
    state.wasteInput *= 0.4;
    const msg = `🌱 Seasonal waste dip at tick ${counter}: wasteInput reduced to ${state.wasteInput.toFixed(2)}`;
    socket.emit('scenario-event', { type: 'seasonal-drop', message: msg, counter });
  }

  // 4. Random power surge
  if (Math.random() < 0.05) {
    const original = state.electricityOutput;
    state.electricityOutput *= 1.5;
    const msg = `⚡ Power surge at tick ${counter}: electricityOutput boosted from ${original.toFixed(2)} to ${state.electricityOutput.toFixed(2)}`;
    socket.emit('scenario-event', { type: 'power-surge', message: msg, counter });
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
    console.log(`🔄 TICK ${counter + 1} - Simulation is running`);
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
      socket.emit('mint-event', { 
        previousValue: 100, 
        newValue: totalElectricity,
        counter: counter 
      });
      socket.emit('scenario-event', { type: 'mint-event', message: msg, counter });
    } else {
      console.log(`Not minting yet: ${totalElectricity.toFixed(2)} < 100`);
    }

    const data: SimData = {
      wasteInput: result.wasteInput,
      methaneGenerated: result.methaneGenerated,
      electricityOutput: totalElectricity,
    };

    socket.emit('biogas-data', data);

    // Switch to next use case every 20 ticks
    if (counter % 30 === 0) {
      currentUseCaseIndex = (currentUseCaseIndex + 1) % useCases.length;
      const msg = `🔄 Switching to use case ${currentUseCaseIndex + 1}`;
      socket.emit('use-case-switch', { useCase: currentUseCaseIndex + 1, counter });
      socket.emit('scenario-event', { type: 'use-case-switch', message: msg, counter });
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
    socket.emit('simulation-stopped', { message: 'Simulation stopped by user' });
    console.log('🛑 Simulation stopped');
  } else {
    socket.emit('simulation-status', { 
      status: 'error', 
      message: 'No active simulation found' 
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
