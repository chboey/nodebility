import OpenAI from 'openai';
import dotenv from 'dotenv';
import { SimData } from '../utils/simulator';
import { handleAgentAction, handleMintEvent } from './agent_actions';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config({ path: ".env.guardian.dev" });

// Check for required environment variables
if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY environment variable is required. Please set it in your .env file.");
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.SECRET_KEY,
});

/**
 * Simple wrapper Agent for running OpenAI chat completions.
 */
class Agent {
  constructor(
    public name: string,
    public instructions: string,
    private model: string = "gpt-4.1-mini"
  ) {}

  async run(
    systemPrompt: string,
    openaiClient: OpenAI,
    maxTokens = 200,
    temperature = 0.1
  ): Promise<string | null | undefined> {
    const response = await openaiClient.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: this.instructions },
      ],
      max_tokens: maxTokens,
      temperature,
    });
    return response.choices[0].message.content;
  }
}




// AI Analysis for Mint Events
export async function analyzeMintData(data: SimData | null, socket: any) {
  if (!data) {
    return {
      scenario: 'data_unavailable',
      confidence: 0.5,
      remarks: 'No data available for analysis'
    };
  }

  const prompt = `
    You are an AI agent analyzing biogas plant data for a mint event (100 kWh milestone reached).
    Analyze the current plant data and provide insights for the mint record.
    
    CURRENT PLANT DATA:
    - Waste Input: ${data.wasteInput} units
    - Methane Generated: ${data.methaneGenerated} units  
    - Electricity Output: ${data.electricityOutput} kWh
    
    ANALYSIS TASK:
    Provide a brief analysis for the mint record including:
    2. Confidence level (0.0-1.0) based on data quality and plant performance
    3. Brief remarks about the current plant condition and efficiency
    
    Respond ONLY with valid JSON:
    {
      "confidence": number (0.0-1.0),
      "remarks": "brief_analysis_of_current_plant_condition"
    }
  `;

  try {
    const agent = new Agent("Assistant", prompt);
    const content = await agent.run(
      "You are an expert biogas plant analyst. Provide concise, accurate analysis for mint records. Respond ONLY with valid JSON, no markdown, no explanations outside the JSON.",
      openai,
      200,
      0.1
    );

    if (content) {
      let jsonContent = content.trim();
      
      // Clean JSON response
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\s*/, '');
      }
      if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\s*/, '');
      }
      if (jsonContent.endsWith('```')) {
        jsonContent = jsonContent.replace(/\s*```$/, '');
      }
      
      const analysis = JSON.parse(jsonContent);

       socket.emit('logs', {
         type: 'mint-analysis',
         message: `🤖 AI Mint Analysis: confidence: ${analysis.confidence}, remarks: ${analysis.remarks}`,
         timestamp: new Date().toISOString(),
         data: analysis
       });

       // Handle mint event here so the logs will appear
       const mintDataWithSimData = {
         currentData: data,
         aiAnalysis: analysis
       };
       
       handleMintEvent(mintDataWithSimData, socket);
    }

  } catch (error) {
    socket.emit('logs', {
      type: 'mint-analysis-error',
      message: `❌ Error in mint analysis: ${error}`,
      timestamp: new Date().toISOString()
    });
    return {
      scenario: 'analysis_error',
      confidence: 0.5,
      remarks: 'AI analysis failed, using default values'
    };
  }
}

// Proactive Analysis Function
export async function analyzeStreamData(biogasDataStream: SimData[], scenarioEvents: any[], hasMadeProposal: boolean, socket: any) {
  if (biogasDataStream.length < 5) return; // Need minimum data points
  
  const recentData = biogasDataStream.slice(-20); // Last 20 data points
  const recentScenarios = scenarioEvents.slice(-10); // Last 10 scenarios
  
  const prompt = `
    You are an observant AI agent monitoring a biogas plant simulation in real-time. 
    Your job is to analyze the current stream and make proactive proposals when you detect issues or opportunities.
    
    CURRENT DATA STREAM (last 20 ticks):
    ${JSON.stringify(recentData, null, 2)}
    
    RECENT SCENARIO EVENTS:
    ${JSON.stringify(recentScenarios, null, 2)}
    
    OBSERVATION TASK:
    Analyze the patterns and determine if you should make a proposal. Look for:
    1. Efficiency drops or anomalies
    2. Consistent underperformance
    3. Waste surges that might indicate supply issues
    4. Methane leaks or conversion problems
    5. Seasonal patterns affecting production
    6. Equipment maintenance needs
    7. Opportunities for optimization
    
    DECISION CRITERIA:
    - Only propose if you detect a clear issue or opportunity
    - Consider the frequency and severity of problems
    - Look for patterns that suggest systemic issues
    - Don't propose for minor fluctuations
    
    PROPOSAL FIELDS (if making a proposal):
    - project_title: Concise, descriptive title
    - project_description: 10-15 word issue/opportunity and solution
    - requested_token_amount: Number of tokens requested (between 100-2000)
    - justification: Clear reasoning for why this proposal is needed
    - urgency: "low", "medium", or "high" based on impact and timeline
    - scenario: Brief description of the current plant scenario/condition
    
    Respond ONLY with valid JSON:
    {
      "shouldPropose": boolean,
      "proposalType": "dao-proposal" | "maintenance-alert" | "optimization-suggestion" | null,
      "reasoning": "detailed explanation of what you observed",
      "confidence": number (0-1),
      "parameters": {
        "issue": "description of the problem",
        "suggestion": "what should be done",
        "urgency": "low" | "medium" | "high",
        "project_title": "descriptive title",
        "project_description": "detailed description with solution",
        "requested_token_amount": "number between 100-2000",
        "justification": "clear reasoning for the proposal",
        "scenario": "current plant condition summary"
      }
    }
  `;

  try {
    const agent = new Agent("Assistant", prompt);
    const content = await agent.run(
      "You are an expert biogas plant analyst. Be observant and proactive. Only make proposals when you detect real issues or opportunities. Respond ONLY with valid JSON, no markdown, no explanations outside the JSON.",
      openai,
      600,
      0.1
    );

    if (content) {
      let jsonContent = content.trim();
      
      // Clean JSON response
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\s*/, '');
      }
      if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\s*/, '');
      }
      if (jsonContent.endsWith('```')) {
        jsonContent = jsonContent.replace(/\s*```$/, '');
      }
      
      const analysis = JSON.parse(jsonContent);
      
      if (analysis.shouldPropose && !hasMadeProposal) {
        socket.emit('logs', {
          type: 'proposal-analysis',
          message: `🤖 AI Agent would propose ${analysis.proposalType}: ${analysis.reasoning}`,
          timestamp: new Date().toISOString(),
          data: analysis
        });
        
        // Use handleAgentAction to create the proposal
        await handleAgentAction(analysis, socket);
        hasMadeProposal = true;
      } else if (analysis.shouldPropose && hasMadeProposal) {
        socket.emit('logs', {
          type: 'proposal-analysis',
          message: `⏸️ AI Agent would propose ${analysis.proposalType} but already made a proposal this cycle`,
          timestamp: new Date().toISOString(),
          data: analysis
        });
      } else {
        socket.emit('logs', {
          type: 'proposal-analysis',
          message: `👁️ AI Agent observing: ${analysis.reasoning}`,
          timestamp: new Date().toISOString(),
          data: analysis
        });
      }
      
      return analysis;
    }
  } catch (error) {
    socket.emit('logs', {
      type: 'stream-analysis-error',
      message: `❌ Error in stream analysis: ${error}`,
      timestamp: new Date().toISOString()
    });
  }
}
