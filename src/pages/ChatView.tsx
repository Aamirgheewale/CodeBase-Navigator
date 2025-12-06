import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAppContext } from '@/context/AppContext';
import { EmptyState } from '@/components/EmptyState';
import { SourceSnippetCard } from '@/components/SourceSnippetCard';
import type { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

export const ChatView: React.FC = () => {
  const { selectedRepo, setInspectorFile, setHighlightedLines } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatMutation = useMutation({
    mutationFn: (query: string) => apiClient.chat(query, selectedRepo!.id),
    onSuccess: (response) => {
      setMessages(prev => [...prev, response]);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(input);
    setInput('');
  };

  const handleOpenSource = async (source: any) => {
    const file = await apiClient.getFile(source.repo, source.path);
    setInspectorFile(file);
    setHighlightedLines({ start: source.startLine, end: source.endLine });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!selectedRepo) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState
          type="repo"
          title="Select a repository"
          description="Choose a repository from the sidebar to start asking questions"
        />
      </div>
    );
  }

  const suggestedQueries = [
    "How is state management handled?",
    "Explain the main entry point",
    "What design patterns are used?",
    "How are components organized?",
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 glow-primary"
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Ask about the code</h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              I can help you understand {selectedRepo.name}. Ask me anything about
              the codebase structure, patterns, or specific implementations.
            </p>

            {/* Suggested Queries */}
            <div className="grid grid-cols-2 gap-2 max-w-lg">
              {suggestedQueries.map((query, i) => (
                <motion.button
                  key={query}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInput(query)}
                  className="p-3 text-left text-sm glass-panel rounded-lg glass-hover"
                >
                  {query}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            <AnimatePresence>
              {messages.map((message, i) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex gap-4',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}

                  <div className={cn(
                    'max-w-[80%]',
                    message.role === 'user' && 'order-first'
                  )}>
                    <div className={cn(
                      'rounded-2xl p-4',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'glass-panel rounded-tl-sm'
                    )}>
                      <div className="prose prose-sm prose-invert max-w-none">
                        {message.content.split('\n').map((line, i) => (
                          <p key={i} className={i > 0 ? 'mt-2' : ''}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Source Snippets */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Sources ({message.sources.length})
                        </span>
                        {message.sources.map((source, idx) => (
                          <SourceSnippetCard
                            key={source.id}
                            snippet={source}
                            index={idx}
                            onOpen={() => handleOpenSource(source)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {chatMutation.isPending && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="glass-panel rounded-2xl rounded-tl-sm p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Analyzing codebase...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about ${selectedRepo.name}...`}
              rows={1}
              className={cn(
                'w-full resize-none rounded-xl border border-border bg-secondary/50 px-4 py-3 pr-12',
                'text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50',
                'transition-all duration-200'
              )}
              style={{ minHeight: '48px', maxHeight: '200px' }}
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || chatMutation.isPending}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg',
                'transition-colors',
                input.trim() && !chatMutation.isPending
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              )}
            >
              {chatMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};
