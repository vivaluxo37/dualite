import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, X, Send, MessageSquare, Loader2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage, setMessages } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
        // Add initial welcome message
        setTimeout(() => {
            setMessages([{
                id: 'initial',
                text: 'Hello! I am the BrokerAnalysis AI assistant. How can I help you today?',
                sender: 'ai',
                timestamp: new Date().toISOString()
            }]);
        }, 500);
    }
  }, [isOpen, messages.length, setMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-[calc(100vw-3rem)] max-w-sm"
            >
              <Card className="h-[60vh] flex flex-col shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                  <div className="flex items-center gap-3">
                    <Bot className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-base">AI Assistant</CardTitle>
                      <CardDescription className="text-xs">BrokerAnalysis Chat</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2">
                       <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                        <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                       </Avatar>
                       <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>
                <div className="border-t p-4">
                  <form onSubmit={handleSend} className="flex items-center gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about brokers..."
                      autoComplete="off"
                      disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-4 flex justify-end"
        >
          <Button
            size="lg"
            className="rounded-full w-16 h-16 shadow-lg"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Chat"
          >
            {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
          </Button>
        </motion.div>
      </div>
    </>
  );
}
