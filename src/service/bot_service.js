export const getAIResponse = async (message) => {
    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Very basic response logic (replace with your actual AI logic)
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
        return "Hello there! How can I assist you?";
    } else if (lowerCaseMessage.includes('how are you')) {
        return "I'm doing well, thank you! How about you?";
    } else if (lowerCaseMessage.includes('help')) {
        return "I can help with many things!  Try asking me a question, or say 'hello'.";
    } else if (lowerCaseMessage.includes('thank you')) {
        return "You're welcome!";
    } else {
        return "I'm still learning, but I can try to answer your question.  Could you say more?";
    }
};