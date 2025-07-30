import dotenv from 'dotenv';
dotenv.config({ path: '.env.guardian.dev' });


// Function to login as admin and return the refreshToken
async function loginAsAdmin(): Promise<string> {
  console.log(process.env.BIONODE_USERNAME, process.env.BIONODE_PASSWORD);
    try {
      const response = await fetch('https://cipherwolves.xyz/api/v1/accounts/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: process.env.BIONODE_USERNAME, password: process.env.BIONODE_PASSWORD })
      });
      if (!response.ok) {
        console.error('Login failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return '';
      }
      const data = await response.json();
      console.log('Login successful:', data);
      return data.refreshToken;
    } catch (err) {
      console.error('Login error:', err);
      return '';
    }
  }

// Use refresh token to get access token
async function getAccessToken(refreshToken: string): Promise<string> {
    const response = await fetch('https://cipherwolves.xyz/api/v1/accounts/access-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token: ${response.status} - ${errorText}`);
    }
  
    const data = await response.json();
    return data.accessToken;
  }
  
  // Use access token to get account session
  async function getAccountSession(accessToken: string) {
    const response = await fetch('https://cipherwolves.xyz/api/v1/accounts/session', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get account session: ${response.status} - ${errorText}`);
    }
  
    return await response.json(); 
  }

export { loginAsAdmin, getAccessToken, getAccountSession };