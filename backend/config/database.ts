import { MongoClient, Db, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.guardian.dev' });

let client: MongoClient;
let db: Db;

const uri = process.env.MONGODB_URI || '';

if (!uri) {
  throw new Error('MONGO_URI is not set');
}

export interface Proposal {
  _id?: string;
  topicId: string;
  initiator: string;
  contractAddress: string;
  project_title: string;
  project_description: string;
  requested_token_amount: string;
  justification: string;
  urgency: string;
  submission_timestamp: string;
  status: string;
  scenario?: string;
  votingTimerHours: number;
  createdAt: Date;
  updatedAt: Date;  
}

export async function connectToDatabase(): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    try {
      await client.connect();
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }
  
  if (!db) {
    db = client.db('bionode-kenya-community');
  }
  
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    console.log('❌ Disconnected from MongoDB');
  }
}

export async function getProposalsCollection() {
  const db = await connectToDatabase();
  return db.collection<Proposal>('proposals');
}

export async function saveProposal(proposalData: Omit<Proposal, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collection = await getProposalsCollection();
  
  const proposal: Proposal = {
    ...proposalData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await collection.insertOne(proposal);
  console.log('💾 Proposal saved to database with ID:', result.insertedId);
  return result.insertedId.toString();
}

export async function getAllProposals(): Promise<Proposal[]> {
  const collection = await getProposalsCollection();
  return await collection.find({}).sort({ createdAt: -1 }).toArray();
}

export async function getProposalByTopicId(topicId: string): Promise<Proposal | null> {
  const collection = await getProposalsCollection();
  return await collection.findOne({ topicId: topicId });
}

export async function updateProposalStatus(topicId: string, status: string): Promise<void> {
  const collection = await getProposalsCollection();
  await collection.updateOne(
    { topicId: topicId },
    { 
      $set: { 
        status: status,
        updatedAt: new Date()
      } 
    }
  );
} 