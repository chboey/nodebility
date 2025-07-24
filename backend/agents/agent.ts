import OpenAI from 'openai';
import dotenv from 'dotenv';
import io from 'socket.io-client';
import { SimData } from '../utils/simulator';
import { handleAgentAction } from './agent_actions';
import { socket } from '../sockets/simulationSocket';

// Load environment variables
dotenv.config();

// Check for required environment variables
if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY environment variable is required. Please set it in your .env file.");
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.SECRET_KEY,
});

// Data collection
let biogasDataStream: SimData[] = [];
let isTestComplete = false;


socket.on('biogas-data', (data: SimData) => {
  console.log('📊 Received biogas data:', data);
  biogasDataStream.push(data);
});

socket.on('done', () => {
  console.log(' Test case finished. Starting analysis...');
  isTestComplete = true;
  
  // Analyze the complete dataset
  analyzeBiogasData(biogasDataStream).then(analysis => {
    console.log(' AI Analysis Result:', analysis);
    
    // Emit the analysis result
    socket.emit('ai-analysis', analysis);

    handleAgentAction(analysis);
    
    // Disconnect after analysis
    setTimeout(() => {
      socket.disconnect();
    }, 1000);
  });
});

socket.on('disconnect', () => {
  console.log('🔌 AI Agent disconnected');
});

// AI Analysis Function
async function analyzeBiogasData(data: SimData[]) {
  const prompt = `
    Given this biogas time-series data from a complete test case:
    ${JSON.stringify(data, null, 2)}
    
    Analyze the pattern and determine:
    1. What scenario is occurring (mint, dao-proposal, idle-stake)
    2. Should an action be triggered?
    3. What parameters should be included?
    
    Consider these patterns:
    - Use Case 1: Gradually increasing electricity output (typical energy generation scenario)
    - Use Case 2: Inefficient digestion (high waste, low methane output)
    - Use Case 3: Idle system / stagnation (very low change in output)
    
    Respond ONLY with valid JSON (no markdown, no code blocks): {"scenario", "shouldTrigger", "parameters", "confidence", "reasoning"}
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert biogas analyst. CRITICAL: Respond ONLY with valid JSON, no markdown formatting, no code blocks, no explanations outside the JSON. Analyze patterns in waste input, methane generation, and electricity output to determine appropriate blockchain actions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.1
    });

         const content = response.choices[0].message.content;
     if (content) {
       // Clean the response to extract pure JSON
       let jsonContent = content.trim();
       
       // Remove markdown code blocks if present
       if (jsonContent.startsWith('```json')) {
         jsonContent = jsonContent.replace(/^```json\s*/, '');
       }
       if (jsonContent.startsWith('```')) {
         jsonContent = jsonContent.replace(/^```\s*/, '');
       }
       if (jsonContent.endsWith('```')) {
         jsonContent = jsonContent.replace(/\s*```$/, '');
       }
       
       console.log('🧹 Cleaned JSON content:', jsonContent);
       
       const analysis = JSON.parse(jsonContent);
       return analysis;
     } else {
       throw new Error("Received null content from AI response");
     }
  } catch (error) {
    console.error("Error analyzing biogas data:", error);
    throw error;
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
