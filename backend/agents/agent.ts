import OpenAI from 'openai';
import dotenv from 'dotenv';
import { SimData } from '../utils/simulator';
import { handleAgentAction } from './agent_actions';
import { socket } from '../sockets/simulationSocket';

// Load environment variables
dotenv.config({ path: ".env.creds.dev" });

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

// Analysis frequency (every 100 data points for proposals)
const PROPOSAL_INTERVAL = 100;
const MIN_ANALYSIS_INTERVAL_MS = 30000; // Minimum 30 seconds between analyses

socket.on('biogas-data', (data: SimData) => {
  biogasDataStream.push(data);
  
  // Keep only last 50 data points to avoid memory issues
  if (biogasDataStream.length > 50) {
    biogasDataStream = biogasDataStream.slice(-50);
  }
  
  // Reset proposal flag at the start of each 100-point cycle
  if (biogasDataStream.length % PROPOSAL_INTERVAL === 0 && hasMadeProposal) {
    hasMadeProposal = false;
    console.log(`🔄 Starting new 100-point cycle. Agent can make proposals again.`);
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

socket.on('mint-event', (info: any) => {
  mintCount++;
  console.log(`🪙 Mint event #${mintCount} at tick ${info.counter}`);
  
  // Only analyze if we haven't made a proposal yet
  if (!hasMadeProposal) {
    setTimeout(() => analyzeStreamData(), 2000);
  }
});

socket.on('scenario-event', (event: any) => {
  scenarioEvents.push(event);
  
  // Keep only last 20 scenario events
  if (scenarioEvents.length > 20) {
    scenarioEvents = scenarioEvents.slice(-20);
  }
  
  // Only analyze for significant scenarios if we haven't made a proposal yet
  if (['waste-surge', 'methane-drop', 'power-surge'].includes(event.type) && !hasMadeProposal) {
    setTimeout(() => analyzeStreamData(), 1000);
  }
});

socket.on('disconnect', () => {
  console.log('🔌 AI Agent disconnected');
});

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
        console.log(`🤖 AI Agent proposes ${analysis.proposalType}: ${analysis.reasoning}`);
        socket.emit('ai-proposal', analysis);
        handleAgentAction(analysis);
        
        // Mark that we've made a proposal
        hasMadeProposal = true;
        lastProposalTick = biogasDataStream.length;
        console.log(`✅ Proposal made at data point ${lastProposalTick}. No more proposals until next 100-point cycle.`);
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
