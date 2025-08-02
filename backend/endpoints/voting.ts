import express from 'express';
import { 
  getActiveProposal, 
  saveVotingResult, 
  getTotalVotingAmount, 
  hasUserVoted 
} from '../config/database';

const router = express.Router();

// Get voting progress for the active proposal
router.get('/get-voting-progress', async (req, res) => {
  try {
    // Get the active proposal (TOP 1)
    const activeProposal = await getActiveProposal();
    
    if (!activeProposal) {
      return res.status(404).json({
        success: false,
        error: 'No active proposal found'
      });
    }

    // Get the project cost (requested token amount)
    const projectCost = parseFloat(activeProposal.requested_token_amount);
    
    // Get total funded amount from all votes
    const funded = await getTotalVotingAmount(activeProposal.topicId);
    
    res.json({
      success: true,
      data: {
        project_cost: projectCost,
        funded: funded
      }
    });
  } catch (error) {
    console.error('❌ Error fetching voting progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch voting progress'
    });
  }
});

// Vote on the active proposal
router.post('/vote', async (req, res) => {
  try {
    const { topicId, accountId, amount } = req.body;
    
    // Validate required fields
    if (!topicId || !accountId || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'topicId, accountId, and amount are required'
      });
    }

    // Validate amount is positive
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    // Get the active proposal to verify it matches
    const activeProposal = await getActiveProposal();
    
    if (!activeProposal) {
      return res.status(404).json({
        success: false,
        error: 'No active proposal found'
      });
    }

    // Verify the topicId matches the active proposal
    if (activeProposal.topicId !== topicId) {
      return res.status(400).json({
        success: false,
        error: 'TopicId does not match the active proposal'
      });
    }

    // Check if user has already voted
    const alreadyVoted = await hasUserVoted(topicId, accountId);
    if (alreadyVoted) {
      return res.status(400).json({
        success: false,
        error: 'User has already voted on this proposal'
      });
    }

    // Save the voting result
    await saveVotingResult({
      topicId,
      accountId,
      amount
    });

    res.json({
      success: true,
      message: 'Vote recorded successfully'
    });
  } catch (error) {
    console.error('❌ Error recording vote:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record vote'
    });
  }
});

export default router; 