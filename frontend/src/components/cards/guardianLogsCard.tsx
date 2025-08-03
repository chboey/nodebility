// components/cards/GuardianLogsCard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle, CardHeader } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Shield } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useSocket } from '@/hooks/useSocket';

interface GuardianLog {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  status: 'Active' | 'Completed' | 'Warning' | 'Error' | 'Verified';
}
const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return {
        dotColor: 'bg-green-500',
        badgeClass: 'bg-green-100 text-green-700',
      };
    case 'completed':
      return {
        dotColor: 'bg-blue-500',
        badgeClass: 'bg-blue-100 text-blue-700',
      };
    case 'warning':
      return {
        dotColor: 'bg-yellow-500',
        badgeClass: 'bg-yellow-100 text-yellow-700',
      };
    case 'error':
      return {
        dotColor: 'bg-red-500',
        badgeClass: 'bg-red-100 text-red-700',
      };
    case 'info':
      return {
        dotColor: 'bg-gray-500',
        badgeClass: 'bg-gray-100 text-gray-700',
      };
    default:
      return {
        dotColor: 'bg-gray-500',
        badgeClass: 'bg-gray-100 text-gray-700',
      };
  }
};

const formatTime = (timeString: string): string => {
  // If it's already formatted, return as is
  if (timeString.includes('ago') || timeString.includes(':')) {
    return timeString;
  }

  // Try to format as a date
  try {
    const date = new Date(timeString);
    return date.toLocaleString();
  } catch {
    return timeString;
  }
};

export const GuardianLogsCard = () => {
  const { simData } = useSocket();
  const [logs, setLogs] = useState<GuardianLog[]>([]);

  useEffect(() => {
    if (simData) {
      const newLog: GuardianLog = {
        id: Date.now(), // unique id
        title: `Sensor Reading`,
        subtitle: `Biogas Level: ${
          simData.biogasLevel || simData.level || 'N/A'
        }`,
        time: new Date().toISOString(),
        status: determineStatus(simData), // Map simData to status
      };

      // Prepend new log
      setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 49)]); // Keep last 50 logs
    }
  }, [simData]);

  const determineStatus = (data: any): GuardianLog['status'] => {
    // Example logic, adjust as needed
    if (data.error) return 'Error';
    if (data.warning) return 'Warning';
    if (data.verified) return 'Verified';
    if (data.completed) return 'Completed';
    return 'Active';
  };

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <span>Guardian Logs</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[20rem] rounded-md">
          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No guardian logs available
              </div>
            ) : (
              logs.map((log) => {
                const statusConfig = getStatusConfig(log.status);
                return (
                  <Card
                    key={log.id}
                    className="border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 transition-colors duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 ${statusConfig.dotColor} rounded-full mt-2 flex-shrink-0`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 truncate">
                            {log.title}
                          </div>
                          <div className="text-sm text-slate-600 mt-1 line-clamp-2">
                            {log.subtitle}
                          </div>
                          <div className="text-xs text-slate-500 mt-2">
                            {formatTime(log.time)}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`flex-shrink-0 ${statusConfig.badgeClass}`}
                        >
                          {log.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
