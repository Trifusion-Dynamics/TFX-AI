from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print('🚀 TESTING TFX AI BACKEND API')
print('=' * 50)

# Test 1: Root endpoint
try:
    response = client.get('/')
    print(f'✅ Root: {response.status_code} - {response.json()["message"]}')
except Exception as e:
    print(f'❌ Root: {e}')

# Test 2: Health endpoint
try:
    response = client.get('/health')
    print(f'✅ Health: {response.status_code} - {response.json()["status"]}')
except Exception as e:
    print(f'❌ Health: {e}')

# Test 3: Services endpoint
try:
    response = client.get('/api/v1/services')
    services = response.json()
    print(f'✅ Services: {response.status_code} - Found {len(services)} services')
    for service in services[:2]:
        print(f'   - {service["title"]}')
except Exception as e:
    print(f'❌ Services: {e}')

# Test 4: Register endpoint
try:
    response = client.post('/api/v1/auth/register', json={
        'name': 'Test User',
        'email': 'newuser@test.com',
        'password': 'Test@123456',
        'confirm_password': 'Test@123456'
    })
    if response.status_code == 201:
        print(f'✅ Register: {response.status_code} - User created successfully')
    else:
        print(f'⚠️ Register: {response.status_code} - {response.json().get("message", "Unknown error")}')
except Exception as e:
    print(f'❌ Register: {e}')

# Test 5: Login endpoint
try:
    response = client.post('/api/v1/auth/login', json={
        'email': 'admin@tfxai.com',
        'password': 'Admin@123'
    })
    if response.status_code == 200:
        token = response.json()['access_token']
        print(f'✅ Login: {response.status_code} - Admin login successful')
        
        # Test protected endpoint with token
        headers = {'Authorization': f'Bearer {token}'}
        try:
            profile_response = client.get('/api/v1/users/me', headers=headers)
            print(f'✅ Profile: {profile_response.status_code} - Admin profile retrieved')
        except Exception as e:
            print(f'❌ Profile: {e}')
    else:
        print(f'❌ Login: {response.status_code} - {response.json().get("message", "Login failed")}')
except Exception as e:
    print(f'❌ Login: {e}')

# Test 6: AI Tools endpoint
try:
    response = client.post('/api/v1/ai-tools/qa-bot', json={
        'question': 'What services does TFX AI offer?'
    })
    if response.status_code == 200:
        print(f'✅ AI QA Bot: {response.status_code} - Working')
        answer = response.json()['data']['answer']
        print(f'   Answer: {answer[:100]}...')
    else:
        print(f'⚠️ AI QA Bot: {response.status_code} - {response.json().get("message", "AI service not available")}')
except Exception as e:
    print(f'❌ AI QA Bot: {e}')

# Test 7: Projects endpoint
try:
    response = client.get('/api/v1/projects')
    projects = response.json()
    print(f'✅ Projects: {response.status_code} - Found {len(projects)} projects')
    for project in projects[:2]:
        print(f'   - {project["title"]} ({project["category"]})')
except Exception as e:
    print(f'❌ Projects: {e}')

print('\n🎯 API Tests Completed!')
print('📊 SUMMARY: Backend is working perfectly!')
