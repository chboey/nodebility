import OpenAI from 'openai';
import dotenv from 'dotenv';
import { SimData } from '../utils/simulator';
import { handleAgentAction, handleMintEvent } from './agent_actions';
import { socket } from '../sockets/simulationSocket';

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

// Data collection and analysis state
let biogasDataStream: SimData[] = [];
let lastAnalysisTime = 0;
let mintCount = 0;
let scenarioEvents: any[] = [];
let lastProposalTick = 0;
let hasMadeProposal = false;
let currentSimData: SimData | null = null;

// Analysis frequency (every 100 data points for proposals)
const PROPOSAL_INTERVAL = 100;
const MIN_ANALYSIS_INTERVAL_MS = 30000; // Minimum 30 seconds between analyses

socket.on('biogas-data', (data: SimData) => {
  biogasDataStream.push(data);
  currentSimData = data; // Track current simulator data
  
  // Keep only last 100 data points to avoid memory issues
  if (biogasDataStream.length > 100) {
    biogasDataStream = biogasDataStream.slice(-100);
  }
  
  // Reset proposal flag at the start of each 100-point cycle
  if (biogasDataStream.length % PROPOSAL_INTERVAL === 0 && hasMadeProposal) {
    hasMadeProposal = false;
  }
  
  // Analyze every 100 data points for proposals
  const now = Date.now();
  if (biogasDataStream.length % PROPOSAL_INTERVAL === 0 && 
      now - lastAnalysisTime > MIN_ANALYSIS_INTERVAL_MS &&
      !hasMadeProposal) {
    analyzeStreamData();
    lastAnalysisTime = now;
  }
});

socket.on('mint-event', async (info: any) => {
  console.log(`🪙 Mint event #${mintCount} at tick ${info.counter}`);
  
  // Analyze the current data with AI for mint scenario
  const aiAnalysis = await analyzeMintData(currentSimData);
  
  // Pass current simulator data along with mint info and AI analysis
  const mintDataWithSimData = {
    ...info,
    currentData: currentSimData,
    aiAnalysis: aiAnalysis
  };
  
  handleMintEvent(mintDataWithSimData);
  mintCount++;
});

socket.on('scenario-event', (event: any) => {
  scenarioEvents.push(event);
  
  // Keep only last 20 scenario events
  if (scenarioEvents.length > 20) {
    scenarioEvents = scenarioEvents.slice(-20);
  }
  
  console.log(`📊 Adding in some noise, adding scenario event: ${event.type}`);
});

socket.on('disconnect', () => {
  console.log('🔌 AI Agent disconnected');
});

// AI Analysis for Mint Events
async function analyzeMintData(data: SimData | null) {
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
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert biogas plant analyst. Provide concise, accurate analysis for mint records. Respond ONLY with valid JSON, no markdown, no explanations outside the JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.1
    });

    const content = response.choices[0].message.content;
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
      console.log(`🤖 AI Mint Analysis: confidence: ${analysis.confidence}, remarks: ${analysis.remarks}`);
      return analysis;
    }
  } catch (error) {
    console.error("Error in mint analysis:", error);
    return {
      scenario: 'analysis_error',
      confidence: 0.5,
      remarks: 'AI analysis failed, using default values'
    };
  }
}

// Proactive Analysis Function
async function analyzeStreamData() {
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
    - project_title: A concise, descriptive title for the proposal
    - project_description: Detailed description of the issue/opportunity and proposed solution
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
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert biogas plant analyst. Be observant and proactive. Only make proposals when you detect real issues or opportunities. Respond ONLY with valid JSON, no markdown, no explanations outside the JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 600,
      temperature: 0.1
    });

    const content = response.choices[0].message.content;
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
        console.log(`🤖 AI Agent would propose ${analysis.proposalType}: ${analysis.reasoning}`);
        
        // Use handleAgentAction to create the proposal
        handleAgentAction(analysis);
        console.log(`✅ Proposal created via handleAgentAction`);
        hasMadeProposal = true;
        lastProposalTick = biogasDataStream.length;
        console.log(`📋 Proposal made at data point ${lastProposalTick}. No more proposals until next 100-point cycle.`);
      } else if (analysis.shouldPropose && hasMadeProposal) {
        console.log(`⏸️ AI Agent would propose ${analysis.proposalType} but already made a proposal this cycle`);
      } else {
        console.log(`👁️ AI Agent observing: ${analysis.reasoning}`);
      }
      
      return analysis;
    }
  } catch (error) {
    console.error("Error in stream analysis:", error);
  }
}

// Error handling
socket.on('connect_error', (error: any) => {
  console.error('❌ Connection error:', error);
});

process.on('SIGINT', () => {
  console.log('🛑 Shutting down AI Agent...');
  socket.disconnect();
  process.exit(0);
});
