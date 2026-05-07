import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"Using API Key: {api_key[:10]}...")

genai.configure(api_key=api_key)

try:
    # Try with gemini-2.0-flash which is available
    print("Trying with gemini-2.0-flash...")
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content("Hello, are you working?")
    print("Response:", response.text)
    print("SUCCESS: Gemini API is working!")
        
except Exception as e:
    print("FAILURE with gemini-2.0-flash:", e)
    try:
        # Fallback to gemini-flash-latest
        print("Trying with gemini-flash-latest...")
        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content("Hello, are you working?")
        print("Response:", response.text)
        print("SUCCESS: Gemini API is working with gemini-flash-latest!")
    except Exception as e2:
        print("FAILURE with gemini-flash-latest:", e2)
