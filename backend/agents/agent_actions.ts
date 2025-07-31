import { mintBiogas } from "../events/handleMinting";
import handleProposalCreation from "../events/handleProposalCreation";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.guardian.dev' });

type ProposalType = 'proposal' | 'maintenance-alert' | 'optimization-suggestion' | 'efficiency-warning'


export async function handleAgentAction(analysisResult: any) {
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
      const { socket } = require('../sockets/simulationSocket');
      socket.emit('proposal-created', {
        projectTitle: parameters.project_title,
        projectDescription: parameters.project_description,
        topicId: proposalResult.topicId,
        proposalId: proposalResult.proposalId,
        votingTimerHours: proposalResult.votingTimerHours,
        urgency: parameters.urgency,
        scenario: parameters.scenario
      });
      
      console.log(`📋 Proposal created and emitted: ${parameters.project_title}`);
    }
  } catch (error) {
    console.error('❌ Error creating proposal:', error);
  }
}

export function handleMintEvent(mintData: any) {
  if (!mintData || typeof mintData !== 'object') {
    console.error('❌ Invalid mint event data');
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

  mintBiogas(mintPayload);
}


