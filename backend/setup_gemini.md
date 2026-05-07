# Gemini API Setup Instructions

## Current Issue
The current Gemini API key has exceeded its free tier quota for some models (like gemini-2.0-flash), but works with gemini-flash-latest.

## Solution Options

### Option 1: Use Current Key (Recommended for testing)
The current API key works with `gemini-flash-latest` model. We've already updated the service to use this model.

### Option 2: Get New API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the new API key
5. Replace the current key in `.env` file:
   ```
   GEMINI_API_KEY=your_new_api_key_here
   ```

### Option 3: Enable Billing (For production)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "Billing" and add a payment method
4. Enable billing for the Generative Language API

## Current Status
✅ Backend API endpoint is working
✅ Frontend is configured correctly  
✅ Chatbot UI is implemented
✅ Error handling is working (shows fallback message when API quota is exceeded)
✅ Using gemini-flash-latest model which works with current quota

## Testing
You can test the chatbot at:
- Frontend: http://localhost:3000 (look for the chat button in bottom-right)
- Backend API: http://localhost:8000/api/v1/ai-tools/chatbot

The chatbot will show a fallback message when Gemini API quota is exceeded, but the UI and functionality are working correctly.
