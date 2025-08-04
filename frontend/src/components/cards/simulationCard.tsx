'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Play, Square, Leaf, Zap, Activity, Cloud, Trash2 } from 'lucide-react';
import { useSocketContext } from '@/context/socketContext';

export const SimulationCards = () => {
  const { isConnected, simData, status, startSimulation, stopSimulation } =
    useSocketContext();
  const [isRunning, setIsRunning] = React.useState(false);

  const handleStart = () => {
    setIsRunning(true);
    if (isConnected) {
      startSimulation();
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    stopSimulation();
  };

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className=" relative z-10">
        <CardTitle className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold">Ecosystem Simulation</span>
            <div className="text-xs text-slate-500 font-normal">
              Bionode Network Control
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-10 relative z-10">
        {/* Status Display */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-100 min-h-[13rem]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Activity
                className={`w-5 h-5 ${
                  isRunning ? 'text-green-500 animate-pulse' : 'text-slate-400'
                }`}
              />
              <span className="font-medium text-sm">
                Status: {isRunning ? 'Active' : 'Inactive'}
              </span>
            </div>
            {isRunning && (
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-slate-600">1 node active</span>
              </div>
            )}
          </div>

          {/* Visual representation of the single bionode */}
          <div className="flex justify-center mb-4">
            <div
              className={`w-10 h-10 rounded-full transition-all duration-500 flex items-center justify-center ${
                isRunning
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl animate-pulse ring-4 ring-green-200'
                  : 'bg-slate-200 shadow-md'
              }`}
            >
              {isRunning && <Leaf className="w-6 h-6 text-white" />}
            </div>
          </div>
          {simData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-xl bg-white/60 backdrop-blur-sm">
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm">
                <Zap className="w-4 h-4 text-blue-500 mb-2" />
                <div className="text-xs text-slate-500">Electricity Output</div>
                <div className="font-bold text-sm text-slate-800">
                  {simData.electricityOutput.toFixed(2)}
                </div>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm">
                <Cloud className="w-4 h-4 text-gray-500 mb-2" />
                <div className="text-xs text-slate-500">Methane Generated</div>
                <div className="font-bold text-sm text-slate-800">
                  {simData.methaneGenerated.toFixed(2)}
                </div>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm">
                <Trash2 className="w-4 h-4 text-red-500 mb-2" />
                <div className="text-xs text-slate-500">Waste Input</div>
                <span>{''}</span>
                <div className="font-bold text-sm text-slate-800">
                  {simData.wasteInput.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleStart}
            disabled={!isConnected}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Simulation
          </Button>

          <Button
            onClick={handleStop}
            disabled={!isRunning}
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-transparent"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop Simulation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
