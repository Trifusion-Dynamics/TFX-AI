import requests
import json

# Test the chatbot endpoint
url = "http://localhost:8000/api/v1/ai-tools/chatbot"

data = {
    "message": "Hello, tell me about your services",
    "conversation_history": [],
    "visitor_name": "Test User",
    "page_context": "Homepage"
}

try:
    print("Testing chatbot endpoint...")
    response = requests.post(url, json=data)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("SUCCESS: Chatbot is working!")
        print(f"Response: {json.dumps(result, indent=2)}")
    else:
        print("ERROR: Chatbot endpoint failed")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"ERROR: {e}")
