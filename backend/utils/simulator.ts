// src/simulator.ts

export interface SimData {
  timestamp: number;
  wasteInput: number;
  methaneGenerated: number;
  electricityOutput: number;
}

function gradualIncrement(base: number, variation: number): number {
  const noise = (Math.random() - 0.5) * variation;
  return Math.max(0, base + noise);
}

// Use-case generators

// Use Case 1: Gradually increasing electricity output (typical energy generation scenario)
function useCase1(counter: number, total: number) {
  return {
    wasteInput: 50 + Math.random() * 10,                   // Moderate, fluctuating waste input
    methaneGenerated: 10 + Math.random() * 5,              // Normal methane generation
    electricityOutput: total + gradualIncrement(3.5, 1.5), // Steady energy increase over time
  };
}

// Use Case 2: Inefficient digestion (high waste, low methane output)
function useCase2(counter: number, total: number) {
  return {
    wasteInput: 65 + Math.random() * 5,                    // High waste input
    methaneGenerated: 6 + Math.random() * 1.5,             // Low methane output (inefficiency)
    electricityOutput: total + gradualIncrement(2.0, 1.0), // Slight energy growth
  };
}

// Use Case 3: Idle system / stagnation (very low change in output)
function useCase3(counter: number, total: number) {
  return {
    wasteInput: 52 + Math.random(),                        // Stable, low waste input
    methaneGenerated: 12 + Math.random(),                  // Normal methane output
    electricityOutput: total + gradualIncrement(0.8, 0.4), // Very slow electricity accumulation
  };
}

const useCases = [useCase1, useCase2, useCase3];

export function simulateRandomStream(socket: any) {
  const maxSteps = 15;
  let counter = 0;
  let totalElectricity = 0;

  const generator = useCases[Math.floor(Math.random() * useCases.length)];

  const interval = setInterval(() => {
    counter++;

    const result = generator(counter, totalElectricity);
    totalElectricity = result.electricityOutput;

    const data: SimData = {
      timestamp: Date.now(),
      ...result,
    };

    socket.emit('biogas-data', data);

    if (counter >= maxSteps) {
      clearInterval(interval);
      socket.emit('done', {});
    }
  }, 1000);
}
