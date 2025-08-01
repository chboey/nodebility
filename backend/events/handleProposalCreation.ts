import {
    Client,
    PrivateKey,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    Hbar
} from "@hashgraph/sdk";
import dotenv from 'dotenv';
import { saveProposal } from '../config/database';

dotenv.config({ path: ".env.guardian.dev" });


async function createProposal(parameters: any) {
    const client = Client.forTestnet().setOperator(process.env.OPERATOR_ID || '', process.env.OPERATOR_KEY || '');

    const transaction = new TopicCreateTransaction()
        .setTopicMemo("Proposal by AI Agent: " + parameters.projectTitle)
        .setAdminKey(PrivateKey.fromStringED25519(process.env.OPERATOR_KEY || ''))
        .setSubmitKey(PrivateKey.fromStringED25519(process.env.OPERATOR_KEY || ''))
        .setMaxTransactionFee(new Hbar(2));

    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const topicId = receipt.topicId;
    if (!topicId) throw new Error("Failed to create topic: topicId is null");

    const proposal = {
        presetFields: [
            { name: "field0", title: "initiator", value: "Bionode-Kenya-01", readonly: false },
            {name:  "field1", title: "contractAddress", value: process.env.contractAddress || '', readonly: false},
            { name: "field2", title: "project_title", value: parameters.projectTitle, readonly: false }, // agent fill this in
            { name: "field3", title: "project_description", value: parameters.projectDescription, readonly: false }, // agent fill this in
            { name: "field4", title: "requested_token_amount", value: parameters.requestedTokenAmount, readonly: false }, // agent fill this in 
            { name: "field5", title: "justification", value: parameters.justification, readonly: false }, // agent fill this in
            { name: "field6", title: "urgency", value: parameters.urgency, readonly: false }, // agent fill this in
            { name: "field7", title: "submission_timestamp", value: new Date().toISOString(), readonly: false },
            { name: "field8", title: "status", value: "awaiting_approval", readonly: false },
            { name: "field9", title: "scenario", value: parameters.scenario, readonly: false } // agent fill this in
        ]
    };

    const messageTx = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify(proposal))
        .setMaxTransactionFee(new Hbar(2));

    const messageSubmitResponse = await messageTx.execute(client);
    const messageReceipt = await messageSubmitResponse.getReceipt(client);

    // Generate random voting timer (between 24 and 168 hours - 1 day to 1 week)
    const votingTimerHours = Math.floor(Math.random() * (168 - 24 + 1)) + 24;

    // Save proposal to MongoDB
    try {
        const proposalData = {
            topicId: topicId.toString(),
            initiator: "Bionode-Kenya-01",
            contractAddress: "Insert your contract address here, dont need to fetch from parameters",
            project_title: parameters.projectTitle,
            project_description: parameters.projectDescription,
            requested_token_amount: parameters.requestedTokenAmount,
            justification: parameters.justification,
            urgency: parameters.urgency,
            submission_timestamp: new Date().toISOString(),
            status: "awaiting_approval",
            scenario: parameters.scenario,
            votingTimerHours: votingTimerHours
        };

        const proposalId = await saveProposal(proposalData);
        
        // Emit proposal created event for frontend
        return {
            success: true,
            topicId: topicId.toString(),
            proposalId: proposalId,
            votingTimerHours: votingTimerHours
        };
    } catch (error) {
        console.error("❌ Error saving proposal to database:", error);
        throw error;
    }
}

export default createProposal;

  