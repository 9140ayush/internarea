const axios = require('axios');

const BASE_URL = 'https://internarea-h88w.onrender.com';

async function testProductionFeatures() {
  console.log('🧪 Testing Production Features...\n');

  const testUser = {
    firebaseUid: 'test-user-' + Date.now(),
    name: 'Test User',
    email: 'test@example.com',
    photoURL: 'https://via.placeholder.com/150'
  };

  try {
    // Test 1: Server Health
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(BASE_URL);
    console.log('✅ Server is running:', healthResponse.data);

    // Test 2: User Sync
    console.log('\n2. Testing user sync...');
    const syncResponse = await axios.post(`${BASE_URL}/api/user/sync`, testUser);
    console.log('✅ User sync successful:', syncResponse.data.success);

    // Test 3: Profile Fetch
    console.log('\n3. Testing profile fetch...');
    const profileResponse = await axios.get(`${BASE_URL}/api/avatar/profile`, {
      headers: { 'x-firebase-uid': testUser.firebaseUid }
    });
    console.log('✅ Profile fetch successful:', profileResponse.data.success);

    // Test 4: Profile Update
    console.log('\n4. Testing profile update...');
    const updateResponse = await axios.put(`${BASE_URL}/api/avatar/profile`, {
      name: 'Updated Test User',
      email: 'updated@example.com'
    }, {
      headers: { 
        'x-firebase-uid': testUser.firebaseUid,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Profile update successful:', updateResponse.data.success);

    // Test 5: DiceBear Avatar Generation
    console.log('\n5. Testing DiceBear avatar generation...');
    const dicebearResponse = await axios.post(`${BASE_URL}/api/avatar/generate-dicebear`, {
      seed: 'test-seed-123',
      style: 'avataaars'
    }, {
      headers: { 
        'x-firebase-uid': testUser.firebaseUid,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ DiceBear generation successful:', dicebearResponse.data.success);

    console.log('\n🎉 All production tests passed!');
    console.log('\n📋 Test Summary:');
    console.log('- ✅ Server health check');
    console.log('- ✅ User synchronization');
    console.log('- ✅ Profile data fetching');
    console.log('- ✅ Profile data updating');
    console.log('- ✅ Avatar generation');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testProductionFeatures(); 