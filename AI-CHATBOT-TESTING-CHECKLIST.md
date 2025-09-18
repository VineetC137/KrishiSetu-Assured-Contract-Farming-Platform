# 🧪 AI Chatbot Testing Checklist

## Pre-Testing Setup
- [ ] MongoDB is running
- [ ] Backend server is running (npm start in backend/)
- [ ] Frontend server is running (npm run dev in frontend/)
- [ ] User is logged in (farmer or buyer account)

## Basic Functionality Tests
- [ ] Floating chat button appears in bottom-right corner
- [ ] Chat button has bounce animation
- [ ] Clicking chat button opens the chatbot window
- [ ] Chatbot window shows "KrishiBot" title and "AI Assistant" subtitle
- [ ] Window can be minimized and maximized
- [ ] Window can be closed with X button

## Chat Tab Tests
- [ ] Chat tab is selected by default
- [ ] Welcome message appears when no chat history
- [ ] Can type message in input field
- [ ] Send button is enabled when message is typed
- [ ] Clicking send button sends message to AI
- [ ] AI response appears in chat window
- [ ] Messages show correct timestamps
- [ ] User messages appear on right (blue)
- [ ] AI messages appear on left (white with border)
- [ ] Chat history persists when reopening chatbot

## Advice Tab Tests
- [ ] Advice tab can be selected
- [ ] Form shows crop type, location, and season fields
- [ ] All fields are required for submission
- [ ] Season dropdown has correct options
- [ ] Submitting form generates farming advice
- [ ] Advice appears in chat tab after submission
- [ ] Form resets after successful submission

## Market Tab Tests
- [ ] Market tab can be selected
- [ ] Form shows crop type and location fields
- [ ] Both fields are required for submission
- [ ] Submitting form generates market insights
- [ ] Insights appear in chat tab after submission
- [ ] Form resets after successful submission

## Contract Tab Tests
- [ ] Contract tab can be selected
- [ ] Form shows crop type and quantity fields
- [ ] Both fields are required for submission
- [ ] Submitting form generates contract advice
- [ ] Advice appears in chat tab after submission
- [ ] Form resets after successful submission

## Multilingual Tests
- [ ] Switch to Hindi language
- [ ] Chatbot UI updates to Hindi
- [ ] AI can respond in Hindi context
- [ ] Switch to Marathi language
- [ ] Chatbot UI updates to Marathi
- [ ] AI can respond in Marathi context
- [ ] Switch back to English
- [ ] All functionality works in English

## Error Handling Tests
- [ ] Network disconnection shows appropriate error
- [ ] Invalid API responses are handled gracefully
- [ ] Form validation errors are displayed
- [ ] Loading states are shown during API calls
- [ ] Error messages are user-friendly

## Performance Tests
- [ ] Chat window opens quickly
- [ ] AI responses arrive within reasonable time
- [ ] No memory leaks with extended usage
- [ ] Smooth scrolling in chat history
- [ ] Responsive design works on mobile

## Advanced Features Tests
- [ ] Clear chat functionality works
- [ ] Chat history pagination (if implemented)
- [ ] Context awareness (farmer vs buyer responses)
- [ ] Specialized advice quality
- [ ] Market insights accuracy
- [ ] Contract advice relevance

## Final Verification
- [ ] All tests pass
- [ ] No console errors
- [ ] User experience is smooth
- [ ] AI responses are helpful and relevant
- [ ] Ready for production deployment

---
**Testing completed on:** ___________
**Tested by:** ___________
**Status:** ___________
