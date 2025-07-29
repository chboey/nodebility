import handleProposalCreation from "../events/handleProposalCreation";

type ProposalType = 'proposal' | 'maintenance-alert' | 'optimization-suggestion' | 'efficiency-warning'

export function handleAgentAction(analysisResult: any) {
  if (!analysisResult || typeof analysisResult !== 'object') {
    console.error('❌ Invalid analysis result');
    return;
  }

  const shouldPropose = analysisResult.shouldPropose ?? false;
  if (!shouldPropose) return;

  const proposalType = analysisResult.proposalType as ProposalType;
  const parameters = analysisResult.parameters || {};


  switch (proposalType) {
    case 'proposal':
      handleProposalCreation({
        projectTitle: parameters.project_title,
        projectDescription: parameters.project_description,
        requestedTokenAmount: parameters.requested_token_amount || "1000",
        justification: parameters.justification,
        urgency: parameters.urgency,
        scenario: parameters.scenario
      });
      break;

    case 'maintenance-alert':
      handleProposalCreation({
        projectTitle: parameters.project_title,
        projectDescription: parameters.project_description,
        requestedTokenAmount: parameters.requested_token_amount || "500",
        justification: parameters.justification,
        urgency: parameters.urgency,
        scenario: parameters.scenario
      });
      break;

    case 'optimization-suggestion':
      handleProposalCreation({
        projectTitle: parameters.project_title,
        projectDescription: parameters.project_description,
        requestedTokenAmount: parameters.requested_token_amount || "750",
        justification: parameters.justification,
        urgency: parameters.urgency,
        scenario: parameters.scenario
      });
      break;

    case 'efficiency-warning':
      handleProposalCreation({
        projectTitle: parameters.project_title,
        projectDescription: parameters.project_description,
        requestedTokenAmount: parameters.requested_token_amount || "300",
        justification: parameters.justification,
        urgency: parameters.urgency,
        scenario: parameters.scenario
      });
      break;
  }
}

export function handleMintEvent(mintData: any) {
  if (!mintData || typeof mintData !== 'object') {
    console.error('❌ Invalid mint event data');
    return;
  }

  console.log(`🪙 Processing mint event`);
  console.log(`   Counter: ${mintData.counter}`);
  console.log(`   Message: ${mintData.message}`);
  
  return {
    type: 'mint-event',
    counter: mintData.counter,
    message: mintData.message,
    action: 'process_mint',
    timestamp: new Date().toISOString()
  };
}