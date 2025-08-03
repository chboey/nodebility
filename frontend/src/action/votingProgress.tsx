interface VotingProgress {
  project_cost: number;
  funded: number;
}

export async function getVotingProgress(): Promise<VotingProgress> {
  const response = await fetch(
    `https://bionode-nodebility-backend.online/api/get-voting-progress`,
    {
      method: 'GET',
      cache: 'no-store', // Disable cache for fresh data
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch voting progress');
  }

  const result = await response.json();

  return result.data as VotingProgress;
}
