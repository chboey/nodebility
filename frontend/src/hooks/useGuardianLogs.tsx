// hooks/useDashboardData.ts
'use client';

import { useState, useEffect } from 'react';
import { logs } from '@/lib/constant';

interface GuardianLog {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  status: 'Active' | 'Completed' | 'Warning' | 'Error' | 'Verified';
}

interface DashboardData {
  guardianLogs: GuardianLog[];
}

interface UseDashboardDataReturn extends DashboardData {
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Transform logs data to match GuardianLog interface
const transformLogsData = (logsData: GuardianLog[]): GuardianLog[] => {
  return logsData.map((log) => ({
    id: log.id,
    title: log.title,
    subtitle: log.subtitle,
    time: log.time,
    status: log.status,
  }));
};

export const UseGuardianLogs = (): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardData>({
    guardianLogs: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, these would be separate API calls
      const guardianLogs = transformLogsData(logs as GuardianLog[]);

      setData({
        guardianLogs,
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    ...data,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
};
