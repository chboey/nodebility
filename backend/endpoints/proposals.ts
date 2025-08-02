import express from 'express';
import { getAllProposals, getProposalByTopicId, updateProposalStatus } from '../config/database';

const router = express.Router();

// Get all proposals
router.get('/proposals', async (req, res) => {
  try {
    const proposals = await getAllProposals();
    res.json({
      success: true,
      data: proposals,
      count: proposals.length
    });
  } catch (error) {
    console.error('❌ Error fetching proposals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch proposals'
    });
  }
});

// Get proposal by topic ID
router.get('/proposals/:topicId', async (req, res) => {
  try {
    const { topicId } = req.params;
    const proposal = await getProposalByTopicId(topicId);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }
    
    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('❌ Error fetching proposal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch proposal'
    });
  }
});

// Update proposal status
router.patch('/proposals/update-proposal-status/:topicId/', async (req, res) => {
  try {
    const { topicId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }
    
    await updateProposalStatus(topicId, status);
    
    res.json({
      success: true,
      message: 'Proposal status updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating proposal status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update proposal status'
    });
  }
});

// Get proposals by status
router.get('/proposals/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const allProposals = await getAllProposals();
    const filteredProposals = allProposals.filter(proposal => proposal.status === status);
    
    res.json({
      success: true,
      data: filteredProposals,
      count: filteredProposals.length
    });
  } catch (error) {
    console.error('❌ Error fetching proposals by status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch proposals by status'
    });
  }
});

// Get recent proposals (last 10)
router.get('/proposals/recent', async (req, res) => {
  try {
    const allProposals = await getAllProposals();
    const recentProposals = allProposals.slice(0, 10);
    
    res.json({
      success: true,
      data: recentProposals,
      count: recentProposals.length
    });
  } catch (error) {
    console.error('❌ Error fetching recent proposals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent proposals'
    });
  }
});

export default router; 