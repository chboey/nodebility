import { Proposal } from '@/components/cards/proposalCard';

export async function fetchProposals(): Promise<Proposal[]> {
  try {
    const res = await fetch(
      'https://bionode-nodebility-backend.online/api/proposals'
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch proposals. Status: ${res.status}`);
    }

    const json = await res.json();

    const proposals: Proposal[] = json.data;
    return proposals;
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return [];
  }
}
