'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Play, Square, Leaf, Zap, Activity } from 'lucide-react';

interface SimulationCardsProps {
  onStartSimulation?: () => void;
  onStopSimulation?: () => void;
}

export const SimulationCards = ({
  onStartSimulation,
  onStopSimulation,
}: SimulationCardsProps) => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [activeNodes, setActiveNodes] = React.useState(0);

  const handleStart = () => {
    setIsRunning(true);
    setActiveNodes(1); // Only 1 node available
    onStartSimulation?.();
  };

  const handleStop = () => {
    setIsRunning(false);
    setActiveNodes(0);
    onStopSimulation?.();
  };

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-20 h-20 bg-green-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-6 left-6 w-16 h-16 bg-emerald-400 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-teal-400 rounded-full blur-md"></div>
      </div>

      <CardHeader className="pb-4 relative z-10">
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

      <CardContent className="space-y-6 relative z-10">
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
              className={`w-14 h-14 rounded-full transition-all duration-500 flex items-center justify-center ${
                isRunning
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl animate-pulse ring-4 ring-green-200'
                  : 'bg-slate-200 shadow-md'
              }`}
            >
              {isRunning && <Leaf className="w-8 h-8 text-white" />}
            </div>
          </div>

          {isRunning && (
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {(Math.random() * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-slate-600">Ecosystem Efficiency</div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleStart}
            disabled={isRunning}
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
