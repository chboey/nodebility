import {
    Client,
    PrivateKey,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    Hbar
} from "@hashgraph/sdk";
import dotenv from 'dotenv';

dotenv.config({ path: ".env.creds.dev" });

// Replace with your Hedera tesstnet credentials
const operatorId = process.env.OPERATOR_ID || "";
const operatorKey = process.env.OPERATOR_KEY || "";

async function createProposal(parameters: any) {
    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    const transaction = new TopicCreateTransaction()
        .setTopicMemo("Proposal by AI Agent: " + parameters.projectTitle)
        .setAdminKey(PrivateKey.fromStringED25519(operatorKey))
        .setSubmitKey(PrivateKey.fromStringED25519(operatorKey))
        .setMaxTransactionFee(new Hbar(2));

    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const topicId = receipt.topicId;
    if (!topicId) throw new Error("Failed to create topic: topicId is null");
    console.log("Created new topic with ID:", topicId.toString());

    const proposal = {
        presetFields: [
            { name: "field0", title: "initiator", value: "Bionode-Kenya-01", readonly: false },
            { name: "field1", title: "project_title", value: parameters.projectTitle, readonly: false }, // agent fill this in
            { name: "field2", title: "project_description", value: parameters.projectDescription, readonly: false }, // agent fill this in
            { name: "field3", title: "requested_token_amount", value: parameters.requestedTokenAmount, readonly: false }, // agent fill this in 
            { name: "field4", title: "justification", value: parameters.justification, readonly: false }, // agent fill this in
            { name: "field5", title: "urgency", value: parameters.urgency, readonly: false }, // agent fill this in
            { name: "field6", title: "submission_timestamp", value: new Date().toISOString(), readonly: false },
            { name: "field7", title: "status", value: "awaiting_approval", readonly: false },
            { name: "field8", title: "scenario", value: parameters.scenario, readonly: false } // agent fill this in
        ]
    };

    const messageTx = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify(proposal))
        .setMaxTransactionFee(new Hbar(2));

    const messageSubmitResponse = await messageTx.execute(client);
    const messageReceipt = await messageSubmitResponse.getReceipt(client);
    console.log("DAO Proposal submitted to topic. Status:", messageReceipt.status.toString());
}

export default createProposal;

  