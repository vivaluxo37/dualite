export class BrokerAnalysisChatbot {
  static async getResponse(message: string): Promise<string> {
    const lowerCaseMessage = message.toLowerCase();

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return "Hello! How can I help you find the best forex broker today? You can ask me about top-rated brokers, brokers for scalping, or brokers with low minimum deposits.";
    }
    if (lowerCaseMessage.includes('top rated') || lowerCaseMessage.includes('best broker')) {
      return "Based on our Trust Score, the top-rated brokers are currently Pepperstone, IC Markets, and Vantage. Would you like to compare them?";
    }
    if (lowerCaseMessage.includes('scalping')) {
      return "For scalping, you'll want brokers with fast execution and low spreads. I recommend looking at IC Markets and Tickmill. They are popular choices for high-frequency traders.";
    }
    if (lowerCaseMessage.includes('low deposit') || lowerCaseMessage.includes('minimum deposit')) {
      return "Many brokers offer low minimum deposits. For example, XM and FBS allow you to start with as little as $5. Is there a specific deposit range you're interested in?";
    }
    if (lowerCaseMessage.includes('compare')) {
        return "You can compare brokers side-by-side using our comparison tool. Just head over to the 'Tools & Analysis' menu and select 'Broker Comparison'.";
    }
    if (lowerCaseMessage.includes('thank')) {
        return "You're welcome! Is there anything else I can assist you with?";
    }

    return "I'm sorry, I'm still learning. I can help with finding top-rated brokers, brokers for specific trading styles like scalping, or brokers with low minimum deposits. How can I assist you?";
  }
}
