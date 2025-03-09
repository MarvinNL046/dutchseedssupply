import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testRegisterAPI() {
  try {
    console.log('Testing registration API...');
    
    // Generate a random email to avoid conflicts
    const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
    
    // Test data
    const testData = {
      email: randomEmail,
      password: 'Password123!',
      name: 'Test User'
    };
    
    console.log(`Using test email: ${testData.email}`);
    
    // Make the request to the registration API
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    // Parse the response
    const data = await response.json();
    
    // Log the results
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('Registration successful!');
    } else {
      console.error('Registration failed:', data.error);
    }
  } catch (error) {
    console.error('Error testing registration API:', error);
  }
}

// Run the test
testRegisterAPI();
