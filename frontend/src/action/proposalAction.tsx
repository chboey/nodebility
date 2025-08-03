import { Proposal } from '@/components/cards/proposalCard';

interface VotePayload {
  topicId: string;
  accountId: string;
  amount: number;
}

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

export async function votingProposal(payload: VotePayload) {
  try {
    const res = await fetch(
      'https://bionode-nodebility-backend.online/api/vote',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch proposals. Status: ${res.status}`);
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return null;
  }
}
