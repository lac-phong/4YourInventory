import axios from 'axios';
import dotenv from 'dotenv';
import { parseStringPromise } from 'xml2js'; // Adjust import for ES modules

dotenv.config();

async function getEbayAuthToken() {
    const tokenUrl = 'https://api.ebay.com/identity/v1/oauth2/token';
    const clientId = process.env.EBAY_APP_NAME;
    const clientSecret = process.env.EBAY_CERT_NAME;

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('scope', 'https://api.ebay.com/oauth/api_scope');

    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post(tokenUrl, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authHeader}`
            }
        });

        console.log('Retrieved eBay auth token:', response.data.access_token); // Log the token for debugging
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching eBay auth token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch eBay auth token');
    }
}

async function fetchEbayListings() {
    const apiUrl = 'https://api.ebay.com/ws/api.dll';
    const headers = {
        'Content-Type': 'text/xml', // Correct content type for XML
        'X-EBAY-API-CALL-NAME': 'GetSellerList',
        'X-EBAY-API-SITEID': '0',
        'X-EBAY-API-APP-NAME': process.env.EBAY_APP_NAME,
        'X-EBAY-API-DEV-NAME': process.env.EBAY_DEV_NAME,
        'X-EBAY-API-CERT-NAME': process.env.EBAY_CERT_NAME,
        'X-EBAY-API-COMPATIBILITY-LEVEL': '967'
    };

    const ebayAuthToken = await getEbayAuthToken(); // Get the OAuth token
    console.log('Using eBay auth token:', ebayAuthToken); // Log the token being used

    const xmlBody = `
        <?xml version="1.0" encoding="utf-8"?>
        <GetSellerListRequest xmlns="urn:ebay:apis:eBLBaseComponents">
            <RequesterCredentials>
                <eBayAuthToken>${ebayAuthToken}</eBayAuthToken>
            </RequesterCredentials>
            <UserID>${process.env.EBAY_USER_ID}</UserID>
            <StartTimeFrom>${new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()}</StartTimeFrom>
            <StartTimeTo>${new Date().toISOString()}</StartTimeTo>
            <Pagination>
                <EntriesPerPage>100</EntriesPerPage>
                <PageNumber>1</PageNumber>
            </Pagination>
            <DetailLevel>ReturnAll</DetailLevel>
        </GetSellerListRequest>
    `;

    try {
        const response = await axios.post(apiUrl, xmlBody, { headers });

        // Log the raw XML response for debugging
        console.log('eBay API raw response:', response.data);

        const parsedResponse = await parseStringPromise(response.data, { explicitArray: false });

        console.log('Parsed eBay API response:', parsedResponse);

        const ebayResponse = parsedResponse.GetSellerListResponse;
        if (ebayResponse && ebayResponse.Ack === 'Success' && ebayResponse.ItemArray) {
            return ebayResponse.ItemArray.Item;
        } else {
            console.error('eBay API call was not successful or response structure is different:', ebayResponse);
            throw new Error('Invalid eBay API response structure or API call failed');
        }
    } catch (error) {
        console.error('Error fetching eBay listings:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch eBay listings');
    }
}

import { executeQuery } from './database.js'; // Ensure you have this utility

export async function updateDatabaseWithEbayData() {
    try {
        const items = await fetchEbayListings();
        if (items) {
            for (const item of items) {
                const part_number = item.ItemID; // Ensure this is the correct field
                const quantity_on_ebay = item.QuantityAvailable;

                const sql = `
                    UPDATE parts
                    SET quantity_on_ebay = ?
                    WHERE part_number = ?;
                `;
                await executeQuery(sql, [quantity_on_ebay, part_number]);
            }
            console.log('Database updated successfully with eBay data.');
        }
    } catch (error) {
        console.error('Error updating database with eBay data:', error.message);
        throw new Error('Failed to update database with eBay data');
    }
}
