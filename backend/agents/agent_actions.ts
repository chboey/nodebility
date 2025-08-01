import { mintBiogas } from "../events/handleMinting";
import handleProposalCreation from "../events/handleProposalCreation";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.guardian.dev' });

type ProposalType = 'proposal' | 'maintenance-alert' | 'optimization-suggestion' | 'efficiency-warning'

export async function handleAgentAction(analysisResult: any, socket?: any) {
  if (!analysisResult || typeof analysisResult !== 'object') {
    console.error('❌ Invalid analysis result');
    return;
  }

  const shouldPropose = analysisResult.shouldPropose ?? false;
  if (!shouldPropose) return;

  const proposalType = analysisResult.proposalType as ProposalType;
  const parameters = analysisResult.parameters || {};

  try {
    let proposalResult;
    
    switch (proposalType) {
      case 'proposal':
        proposalResult = await handleProposalCreation({
          projectTitle: parameters.project_title,
          projectDescription: parameters.project_description,
          requestedTokenAmount: parameters.requested_token_amount || "1000",
          justification: parameters.justification,
          urgency: parameters.urgency,
          scenario: parameters.scenario
        });
        break;

      case 'maintenance-alert':
        proposalResult = await handleProposalCreation({
          projectTitle: parameters.project_title,
          projectDescription: parameters.project_description,
          requestedTokenAmount: parameters.requested_token_amount || "500",
          justification: parameters.justification,
          urgency: parameters.urgency,
          scenario: parameters.scenario
        });
        break;

      case 'optimization-suggestion':
        proposalResult = await handleProposalCreation({
          projectTitle: parameters.project_title,
          projectDescription: parameters.project_description,
          requestedTokenAmount: parameters.requested_token_amount || "750",
          justification: parameters.justification,
          urgency: parameters.urgency,
          scenario: parameters.scenario
        });
        break;

      case 'efficiency-warning':
        proposalResult = await handleProposalCreation({
          projectTitle: parameters.project_title,
          projectDescription: parameters.project_description,
          requestedTokenAmount: parameters.requested_token_amount || "300",
          justification: parameters.justification,
          urgency: parameters.urgency,
          scenario: parameters.scenario
        });
        break;
    }

    // Emit proposal created event to frontend
    if (proposalResult && proposalResult.success) {
      const proposalLog = {
        type: 'proposal-created',
        timestamp: new Date().toISOString(),
        data: {
          projectTitle: parameters.project_title,
          projectDescription: parameters.project_description,
          topicId: proposalResult.topicId,
          proposalId: proposalResult.proposalId,
          votingTimerHours: proposalResult.votingTimerHours,
          urgency: parameters.urgency,
          scenario: parameters.scenario,
          requestedAmount: parameters.requested_token_amount
        }
      };

      // Emit to the same socket connection
      if (socket) {
        socket.emit('logs', {
          type: 'proposal-created-message',
          message: `Proposal created! Project Title: ${parameters.project_title}, Topic ID: ${proposalResult.topicId}`,
          proposalLog: proposalLog
        });
      }
    }
  } catch (error) {
    // Emit error log
    if (socket) {
      socket.emit('logs', {
        type: 'proposal-error',
        timestamp: new Date().toISOString(),
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
          proposalType: proposalType
        }
      });
    }
  }
}

export function handleMintEvent(mintData: any, socket?: any) {
  if (!mintData || typeof mintData !== 'object') {
    socket.emit('logs', {
      type: 'mint-error',
      message: '❌ Invalid mint event data',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Extract the current simulator data for the mint
  const currentData = mintData.currentData || {};
  
  // Extract AI analysis results
  const aiAnalysis = mintData.aiAnalysis || {
    confidence: 0.5,
    remarks: 'AI analysis not available'
  };
  
  // Prepare the mint payload with the required fields
  const mintPayload = {
    document: {
    field0: process.env.didSecretString,
    field1: new Date().toISOString(), // timestamp to string
    field2: currentData.wasteInput || 0, // waste_input
    field3: currentData.methaneGenerated || 0, // methane_generated
    field4: 100, // electricity_output (every 100 kwh is 1 token)
    field5: "mint", 
    field6: aiAnalysis.confidence, 
    field7: aiAnalysis.remarks 
  }};

  try {
    // Attempt to mint
    mintBiogas(mintPayload);
    
    // Emit successful mint log
    const mintLog = {
      type: 'mint-success',
      timestamp: new Date().toISOString(),
      data: {
        wasteInput: currentData.wasteInput || 0,
        methaneGenerated: currentData.methaneGenerated || 0,
        electricityOutput: currentData.electricityOutput || 0,
        aiConfidence: aiAnalysis.confidence,
        aiRemarks: aiAnalysis.remarks,
        mintAmount: 100, // 100 kWh = 1 token
        counter: mintData.counter
      }
    };

    if (socket) {
      socket.emit('logs', {
        type: 'mint-success',
        message: `🪙 Biogas minted! Please Check your transaction on the Hashscan or Hedera Guardian`,
        timestamp: new Date().toISOString(),
        data: mintLog.data
      });
    }

    
  } catch (error) {
    // Emit mint error log
    if (socket) {
      socket.emit('logs', {
        type: 'mint-error',
        timestamp: new Date().toISOString(),
        data: {
          error: error instanceof Error ? error.message : 'Unknown minting error',
          wasteInput: currentData.wasteInput || 0,
          methaneGenerated: currentData.methaneGenerated || 0,
          electricityOutput: currentData.electricityOutput || 0,
          counter: mintData.counter
        }
      });
    }
  }
}


