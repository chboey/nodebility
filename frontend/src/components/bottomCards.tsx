'use client';

import React from 'react';
import { Card, CardContent, CardTitle, CardHeader } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Clock, Shield } from 'lucide-react';
import { Badge } from './ui/badge';
import { logs } from '@/lib/constant';

export const BottomCards = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Proposals */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <span>Upcoming Proposals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[20rem] rounded-md">
              <div className="space-y-3">
                {logs.map((log) => (
                  <Card
                    key={log.id}
                    className="border border-slate-200 bg-slate-50/50"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Nuclear Proposal</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Proposal for nuclear energy integration into the
                            biogas network
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200"
                        >
                          Pending
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Guardian Logs */}
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
                {logs.map((log) => (
                  <Card
                    key={log.id}
                    className="border border-slate-200 bg-slate-50/50"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium">{log.title}</div>
                          <div className="text-sm text-slate-600 mt-1">
                            {log.subtitle}
                          </div>
                          <div className="text-xs text-slate-500 mt-2">
                            {log.time}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700"
                        >
                          {log.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
