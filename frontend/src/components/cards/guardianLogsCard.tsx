'use client';

import React from 'react';
import { Card, CardContent, CardTitle, CardHeader } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Shield } from 'lucide-react';
import { useSocketContext } from '@/context/socketContext';

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'mint-success':
      return {
        dotColor: 'bg-green-500',
        badgeClass: 'bg-green-100 text-green-700',
      };
    case 'mint-analysis':
      return {
        dotColor: 'bg-blue-500',
        badgeClass: 'bg-blue-100 text-blue-700',
      };
    case 'proposal-created-message':
      return {
        dotColor: 'bg-yellow-500',
        badgeClass: 'bg-yellow-100 text-yellow-700',
      };
    case 'proposal-analysis':
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

export const GuardianLogsCard = () => {
  const { logsData } = useSocketContext();

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
            {logsData && logsData.length > 0 ? (
              logsData.map((log, index) => {
                const statusConfig = getStatusConfig(log.type);
                return (
                  <Card
                    key={`${log.timestamp}-${index}`}
                    className="border border-slate-200 bg-white hover:bg-slate-100 transition-colors duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 ${statusConfig.dotColor} rounded-full mt-2 flex-shrink-0`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 truncate">
                            {log.type}
                          </div>
                          <div className="text-sm text-slate-600 mt-1 line-clamp-2">
                            {log.message}
                          </div>
                          <div className="text-xs text-slate-500 mt-2">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500">
                No guardian logs available
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
