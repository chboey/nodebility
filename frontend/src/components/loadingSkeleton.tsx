'use client';

import { Card, CardContent } from './ui/card';

export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          className="shadow-lg border-0 bg-white/70 backdrop-blur-sm"
        >
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
