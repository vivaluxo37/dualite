import { supabase } from './supabase';
import type { Database } from '../types/supabase';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

type Broker = Database['public']['Tables']['brokers']['Row'];

export class BrokerAnalysisChatbot {
  private static conversationContext: string[] = [];
  private static brokerCache: Broker[] | null = null;
  private static cacheTimestamp: number = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async getResponse(message: string): Promise<string> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const lowerMessage = message.toLowerCase();
      let response: string;

      // Check for contextual responses first
      const contextualResponse = this.getContextualResponse(message);
      if (contextualResponse) {
        response = contextualResponse;
      }
      // Check for greetings
      else if (this.isGreeting(lowerMessage)) {
        response = "Hello! I'm your Broker Analysis assistant. I can help you find the best forex brokers based on your trading needs. What are you looking for today?";
      }
      // Check for broker-specific requests
      else if (this.isBrokerRequest(lowerMessage)) {
        response = await this.getBrokerRecommendations(lowerMessage);
      }
      // Check for feature-based queries
      else if (this.isFeatureQuery(lowerMessage)) {
        response = await this.getFeatureBasedRecommendations(lowerMessage);
      }
      // Check for regulation queries
      else if (this.isRegulationQuery(lowerMessage)) {
        response = await this.getRegulationBasedRecommendations(lowerMessage);
      }
      // Check for platform queries
      else if (this.isPlatformQuery(lowerMessage)) {
        response = await this.getPlatformBasedRecommendations(lowerMessage);
      }
      // Check for account type queries
      else if (this.isAccountTypeQuery(lowerMessage)) {
        response = await this.getAccountTypeRecommendations(lowerMessage);
      }
      // Default response with suggestions
      else {
        response = "I can help you find the perfect forex broker! Try asking me about:\n\n" +
          "• Specific brokers (e.g., 'Tell me about IG Markets')\n" +
          "• Trading features (e.g., 'Low spread brokers')\n" +
          "• Regulation (e.g., 'FCA regulated brokers')\n" +
          "• Platforms (e.g., 'MetaTrader 4 brokers')\n" +
          "• Account types (e.g., 'ECN account brokers')\n\n" +
          "What would you like to know?";
      }

      // Add to conversation context
      this.addToContext(message, response);
      
      return response;

    } catch (error) {
      console.error('Chatbot error:', error);
      const errorResponse = "I'm sorry, I'm having trouble connecting to our broker database right now. Please try again in a moment.";
      this.addToContext(message, errorResponse);
      return errorResponse;
    }
  }

  private static async getBrokers(): Promise<Broker[]> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.brokerCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.brokerCache;
    }
    
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('is_active', true)
        .order('overall_rating', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      this.brokerCache = data || [];
      this.cacheTimestamp = now;
      
      return this.brokerCache;
    } catch (error) {
      console.error('Error fetching brokers:', error);
      return [];
    }
  }

  private static isGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greeting => message.includes(greeting));
  }

  private static isBrokerRequest(message: string): boolean {
    const keywords = ['broker', 'recommend', 'suggest', 'best', 'top', 'find', 'looking for'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private static isFeatureQuery(message: string): boolean {
    const features = ['spread', 'leverage', 'commission', 'deposit', 'withdrawal', 'fee', 'cost'];
    return features.some(feature => message.includes(feature));
  }

  private static isRegulationQuery(message: string): boolean {
    const regulations = ['regulation', 'regulated', 'license', 'fca', 'cysec', 'asic', 'cftc', 'nfa'];
    return regulations.some(reg => message.includes(reg));
  }

  private static isPlatformQuery(message: string): boolean {
    const platforms = ['platform', 'mt4', 'mt5', 'metatrader', 'ctrader', 'trading platform'];
    return platforms.some(platform => message.includes(platform));
  }

  private static isAccountTypeQuery(message: string): boolean {
    const accountTypes = ['account', 'demo', 'live', 'micro', 'standard', 'ecn', 'stp'];
    return accountTypes.some(type => message.includes(type));
  }

  private static getGreetingResponse(): string {
    const responses = [
      "Hello! I'm your Broker Analysis assistant. I can help you find the perfect forex broker based on your trading needs. What are you looking for?",
      "Hi there! I'm here to help you discover the best forex brokers. Are you looking for low spreads, high leverage, or specific regulations?",
      "Welcome! I can provide personalized broker recommendations. Tell me about your trading style and preferences."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private static async getBrokerRecommendations(message: string): Promise<string> {
    const brokers = await this.getBrokers();
    
    if (brokers.length === 0) {
      return "I'm having trouble accessing our broker database right now. Please try again in a moment.";
    }
    
    // Get top 3 brokers by rating
    const topBrokers = brokers.slice(0, 3);
    
    let response = "Based on our analysis, here are some top-rated brokers:\n\n";
    
    topBrokers.forEach((broker, index) => {
      response += `${index + 1}. **${broker.name}**\n`;
      response += `   • Rating: ${broker.overall_rating}/5\n`;
      response += `   • Min Deposit: $${broker.min_deposit}\n`;
      if (broker.max_leverage) {
        response += `   • Max Leverage: ${broker.max_leverage}\n`;
      }
      response += `\n`;
    });
    
    response += "Would you like more details about any of these brokers, or do you have specific requirements?";
    
    return response;
  }

  private static async getFeatureBasedRecommendations(message: string): Promise<string> {
    const brokers = await this.getBrokers();
    
    if (brokers.length === 0) {
      return "I'm having trouble accessing our broker database right now. Please try again in a moment.";
    }
    
    if (message.includes('spread')) {
      const lowSpreadBrokers = brokers
        .filter(broker => broker.avg_spread !== null)
        .sort((a, b) => (a.avg_spread || 999) - (b.avg_spread || 999))
        .slice(0, 3);
      
      let response = "Here are brokers with the lowest spreads:\n\n";
      lowSpreadBrokers.forEach((broker, index) => {
        response += `${index + 1}. **${broker.name}** - Average Spread: ${broker.avg_spread} pips\n`;
      });
      return response;
    }
    
    if (message.includes('leverage')) {
      const highLeverageBrokers = brokers
        .filter(broker => broker.max_leverage !== null)
        .sort((a, b) => parseInt(b.max_leverage?.replace(':', '') || '0') - parseInt(a.max_leverage?.replace(':', '') || '0'))
        .slice(0, 3);
      
      let response = "Here are brokers with high leverage options:\n\n";
      highLeverageBrokers.forEach((broker, index) => {
        response += `${index + 1}. **${broker.name}** - Max Leverage: ${broker.max_leverage}\n`;
      });
      return response;
    }
    
    if (message.includes('deposit')) {
      const lowDepositBrokers = brokers
        .filter(broker => broker.min_deposit !== null)
        .sort((a, b) => (a.min_deposit || 999999) - (b.min_deposit || 999999))
        .slice(0, 3);
      
      let response = "Here are brokers with low minimum deposits:\n\n";
      lowDepositBrokers.forEach((broker, index) => {
        response += `${index + 1}. **${broker.name}** - Min Deposit: $${broker.min_deposit}\n`;
      });
      return response;
    }
    
    return "I can help you find brokers based on spreads, leverage, or minimum deposit requirements. What specific feature are you most interested in?";
  }

  private static async getRegulationBasedRecommendations(message: string): Promise<string> {
    const brokers = await this.getBrokers();
    
    if (brokers.length === 0) {
      return "I'm having trouble accessing our broker database right now. Please try again in a moment.";
    }
    
    let regulationFilter = '';
    if (message.includes('fca')) regulationFilter = 'FCA';
    else if (message.includes('cysec')) regulationFilter = 'CySEC';
    else if (message.includes('asic')) regulationFilter = 'ASIC';
    else if (message.includes('cftc') || message.includes('nfa')) regulationFilter = 'CFTC';
    
    if (regulationFilter) {
      const regulatedBrokers = brokers
        .filter(broker => broker.regulation?.includes(regulationFilter))
        .slice(0, 3);
      
      if (regulatedBrokers.length > 0) {
        let response = `Here are ${regulationFilter}-regulated brokers:\n\n`;
        regulatedBrokers.forEach((broker, index) => {
          response += `${index + 1}. **${broker.name}** - ${broker.regulation}\n`;
        });
        return response;
      } else {
        return `I couldn't find any ${regulationFilter}-regulated brokers in our current database. Would you like to see brokers with other regulations?`;
      }
    }
    
    return "I can help you find brokers regulated by FCA, CySEC, ASIC, or CFTC. Which regulation are you looking for?";
  }

  private static async getPlatformBasedRecommendations(message: string): Promise<string> {
    const brokers = await this.getBrokers();
    
    if (brokers.length === 0) {
      return "I'm having trouble accessing our broker database right now. Please try again in a moment.";
    }
    
    let platformFilter = '';
    if (message.includes('mt4') || message.includes('metatrader 4')) platformFilter = 'MT4';
    else if (message.includes('mt5') || message.includes('metatrader 5')) platformFilter = 'MT5';
    else if (message.includes('ctrader')) platformFilter = 'cTrader';
    
    if (platformFilter) {
      const platformBrokers = brokers
        .filter(broker => broker.trading_platforms?.includes(platformFilter))
        .slice(0, 3);
      
      if (platformBrokers.length > 0) {
        let response = `Here are brokers that offer ${platformFilter}:\n\n`;
        platformBrokers.forEach((broker, index) => {
          response += `${index + 1}. **${broker.name}** - Platforms: ${broker.trading_platforms}\n`;
        });
        return response;
      } else {
        return `I couldn't find brokers specifically offering ${platformFilter}. Most brokers offer multiple platforms including MT4 and MT5.`;
      }
    }
    
    return "I can help you find brokers that offer MT4, MT5, or cTrader platforms. Which trading platform do you prefer?";
  }

  private static async getAccountTypeRecommendations(message: string): Promise<string> {
    const brokers = await this.getBrokers();
    
    if (brokers.length === 0) {
      return "I'm having trouble accessing our broker database right now. Please try again in a moment.";
    }
    
    if (message.includes('demo')) {
      return "Most reputable brokers offer demo accounts for practice trading. Here are some top-rated options with demo accounts:\n\n" +
        brokers.slice(0, 3).map((broker, index) => 
          `${index + 1}. **${broker.name}** - Rating: ${broker.overall_rating}/5`
        ).join('\n') + 
        "\n\nDemo accounts are great for testing strategies risk-free!";
    }
    
    if (message.includes('micro')) {
      const microBrokers = brokers
        .filter(broker => (broker.min_deposit || 0) <= 100)
        .slice(0, 3);
      
      let response = "Here are brokers suitable for micro accounts (low minimum deposits):\n\n";
      microBrokers.forEach((broker, index) => {
        response += `${index + 1}. **${broker.name}** - Min Deposit: $${broker.min_deposit}\n`;
      });
      return response;
    }
    
    return "I can help you find brokers with demo accounts, micro accounts, or specific account types. What type of account are you interested in?";
  }

  private static getHelpResponse(): string {
    const helpTopics = [
      "• Ask about **top-rated brokers** for general recommendations",
      "• Inquire about **low spreads** or **high leverage** for specific features",
      "• Ask about **regulation** (FCA, CySEC, ASIC, CFTC) for compliance",
      "• Ask about **trading platforms** (MT4, MT5, cTrader)",
      "• Ask about **account types** (demo, micro, standard)",
      "• Ask about **minimum deposits** for budget-friendly options"
    ];
    
    return "I'm here to help you find the perfect forex broker! Here's what I can assist with:\n\n" +
      helpTopics.join('\n') + 
      "\n\nJust ask me about any of these topics, and I'll provide personalized recommendations based on our broker database.";
  }

  // Context management
  static clearContext(): void {
    this.conversationContext = [];
  }

  static getContext(): string[] {
    return [...this.conversationContext];
  }

  // Add context to conversation
  private static addToContext(userMessage: string, aiResponse: string): void {
    this.conversationContext.push(`User: ${userMessage}`);
    this.conversationContext.push(`AI: ${aiResponse}`);
    
    // Keep only last 10 exchanges (20 messages)
    if (this.conversationContext.length > 20) {
      this.conversationContext = this.conversationContext.slice(-20);
    }
  }

  // Get contextual response based on conversation history
  private static getContextualResponse(message: string): string | null {
    const context = this.conversationContext.join(' ').toLowerCase();
    const lowerMessage = message.toLowerCase();

    // If user is asking for more details about previously mentioned brokers
    if ((lowerMessage.includes('more') || lowerMessage.includes('tell me') || lowerMessage.includes('details')) && 
        (context.includes('broker') || context.includes('recommend'))) {
      return "I'd be happy to provide more details! Could you specify which broker you'd like to know more about, or what specific aspect interests you (spreads, regulation, platforms, etc.)?";
    }

    // If user is asking follow-up questions
    if (lowerMessage.includes('what about') || lowerMessage.includes('how about')) {
      return "That's a great follow-up question! Let me help you with that specific aspect.";
    }

    // If user seems confused or asks for clarification
    if (lowerMessage.includes('confused') || lowerMessage.includes('don\'t understand') || lowerMessage.includes('clarify')) {
      return "I understand this can be overwhelming. Let me break it down simply: I can help you find forex brokers based on your specific needs. What's most important to you - low costs, good regulation, specific trading platforms, or something else?";
    }

    return null;
  }
}
