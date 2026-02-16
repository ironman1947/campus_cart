const axios = require('axios');

const testAuth = async () => {
    try {
        console.log('1. Attempting Login...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'alice@example.com',
            password: 'password123'
        });

        const token = loginRes.data.token;
        console.log('Login Success! Token:', token ? 'Yes' : 'No');

        if (!token) {
            console.error('No token received');
            return;
        }

        console.log('2. Attempting to fetch Profile...');
        const profileRes = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Profile Fetch Success!', profileRes.data);
    } catch (err) {
        console.error('Test Failed:', err.response ? err.response.data : err.message);
    }
};

testAuth();
