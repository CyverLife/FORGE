require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key (first 10 chars):', supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + '...' : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('ERROR: Missing environment variables.');
    process.exit(1);
}

// Custom fetch implementation using axios for supabase client
const customFetch = async (url, options) => {
    try {
        const response = await axios({
            url,
            method: options.method || 'GET',
            headers: options.headers,
            data: options.body,
            validateStatus: () => true // Don't throw on error status
        });

        return {
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            statusText: response.statusText,
            json: async () => response.data,
            text: async () => JSON.stringify(response.data),
            headers: {
                get: (name) => response.headers[name]
            }
        };
    } catch (error) {
        console.error('Axios Fetch Error:', error.message);
        throw error;
    }
};

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    },
    global: {
        fetch: customFetch
    }
});

async function testConnection() {
    try {
        console.log('Attempting to get session (validating connection)...');
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Supabase Error:', error.message);
        } else {
            console.log('Supabase Connection Successful! (Session retrieved)');
        }

        console.log('Attempting direct health check...');
        try {
            const response = await axios.get(`${supabaseUrl}/auth/v1/health`);
            console.log('Health Check Status:', response.status, response.statusText);
        } catch (err) {
            console.error('Health Check Failed:', err.message);
        }

    } catch (err) {
        console.error('Unexpected script error:', err);
    }
}

testConnection();
