import { loginAsAdmin, getAccessToken, getAccountSession } from '../services/authService';
import { getPolicies, mintToken } from '../services/policyService';
import { isTokenAssociatedWithAccount, associateTokenToNewHederaAccount } from './handleTokenAssociation';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.guardian.dev' });

export async function mintBiogas(mintPayload?: any){

    // Check if the token is associated with the account
    const isAssociated = await isTokenAssociatedWithAccount(process.env.tokenId || '', process.env.OPERATOR_ID || '');
    
    if (!isAssociated) {
        await associateTokenToNewHederaAccount();
    }

    //Get a refresh token from login
    const refreshToken = await loginAsAdmin();

    if(!refreshToken){
        throw new Error('No refresh token received from login');
    }

    //Get an access token from the refresh token
    const accessToken = await getAccessToken(refreshToken);

    if(!accessToken){
        throw new Error('No access token received from getAccessToken');
    }
    
    //Get the policy
    const policy = await getPolicies(accessToken);

    if(!policy){
        throw new Error('No policy received from getPolicies');
    }

    const blockData = await mintToken(accessToken, process.env.mintTokenRequestVCBlock_policyID || '', process.env.mintTokenRequestVCBlock_blockUUID || '', mintPayload || {});

    if(!blockData){
        throw new Error('No block data received from mintToken');
    }

}


