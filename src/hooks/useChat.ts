import { useState, useCallback } from 'react';
import { BrokerAnalysisChatbot } from '../lib/chatbot';
import type { ChatMessage } from '../types';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your Broker Analysis assistant. I can help you find the best forex brokers based on your trading needs. What are you looking for?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await BrokerAnalysisChatbot.getResponse(text);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      // Add error message to chat
      const errorChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm experiencing technical difficulties. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        text: "Hello! I'm your Broker Analysis assistant. I can help you find the best forex brokers based on your trading needs. What are you looking for?",
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
    setError(null);
    BrokerAnalysisChatbot.clearContext();
  }, []);

  const retryLastMessage = useCallback(() => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      if (lastUserMessage.sender === 'user') {
        // Remove the last AI message (error message) and retry
        setMessages(prev => prev.slice(0, -1));
        sendMessage(lastUserMessage.text);
      }
    }
  }, [messages, sendMessage]);

  return { 
    messages, 
    sendMessage, 
    isLoading, 
    error, 
    clearMessages, 
    retryLastMessage 
  };
}
