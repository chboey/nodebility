async function getProfile(accessToken: string, accountUsername: string){
    try{
      const url = new URL(`https://cipherwolves.xyz/api/v1/profiles/${accountUsername}`);
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to get profile:', response.status, errorText);
        return;
      }
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const rawText = await response.text();
        throw new Error(`Expected JSON but got: ${contentType}\nResponse:\n${rawText}`);
      }
      const profile = await response.json();
      console.log('Profile:', profile);
      return profile;
    }
    catch(err){
      console.error('🚨 Error fetching profile:', err);
    }
  
  }
  