import { useState } from 'react';
import { ChatMessage } from '@/types';
import { BrokerAnalysisChatbot } from '@/lib/chatbot';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    addMessage(userMessage, 'user');
    setIsLoading(true);

    try {
      const aiResponse = await BrokerAnalysisChatbot.getResponse(userMessage);
      addMessage(aiResponse, 'ai');
    } catch {
      addMessage('Sorry, something went wrong. Please try again later.', 'ai');
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage, setMessages };
}
