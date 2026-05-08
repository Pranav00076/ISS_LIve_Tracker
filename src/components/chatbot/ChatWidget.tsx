import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { Send, X, Trash2, MessageSquare, Bot, User } from "lucide-react";
import { useChatbot, Message } from "../../hooks/useChatbot";
import { Position } from "../../utils/geo";
import { TavilyArticle } from "../../services/tavilyService";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils/cn";

interface ChatWidgetProps {
  currentPosition: Position | null;
  history: Position[];
  speed: number;
  astronauts: { name: string; craft: string }[];
  articles: TavilyArticle[];
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm w-fit mr-12 text-slate-500">
      <div
        className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}

function ChatMessageBubble({ message }: { message: Message }) {
  const isAI = message.role === "ai";
  return (
    <div
      className={cn("flex flex-col mb-4", isAI ? "items-start" : "items-end")}
    >
      <div
        className={cn(
          "flex items-end gap-2 max-w-[85%]",
          isAI ? "flex-row" : "flex-row-reverse",
        )}
      >
        <div
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs",
            isAI
              ? "bg-blue-600 text-white"
              : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
          )}
        >
          {isAI ? <Bot size={14} /> : <User size={14} />}
        </div>
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
            isAI
              ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm"
              : "bg-blue-600 text-white rounded-br-sm",
          )}
        >
          {isAI ? (
            <div className="markdown-body prose prose-sm dark:prose-invert">
              <Markdown>{message.content}</Markdown>
            </div>
          ) : (
            message.content
          )}
        </div>
      </div>
    </div>
  );
}

export function ChatWidget(props: ChatWidgetProps) {
  const {
    messages,
    isOpen,
    isTyping,
    toggleChat,
    closeChat,
    clearChat,
    sendMessage,
  } = useChatbot(
    props.currentPosition,
    props.history,
    props.speed,
    props.astronauts,
    props.articles,
  );

  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-4 right-4 md:bottom-6 md:right-6 p-4 rounded-full shadow-xl transition-all duration-300 z-50",
          "bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/30",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100",
        )}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-32px)] md:w-[400px] h-[500px] max-h-[calc(100vh-32px)] md:max-h-[80vh] bg-white dark:bg-[#151828] border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">
                    Dashboard AI
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Context-Aware Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Clear Chat"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={closeChat}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/50 dark:bg-[#0B0D17]/50">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 space-y-3">
                  <Bot size={40} className="text-blue-500 opacity-50" />
                  <p className="text-sm px-4">
                    Hello! I can answer questions about the live ISS satellite
                    data and the latest news articles currently active in your
                    dashboard.
                  </p>
                </div>
              )}
              {messages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-[#151828] border-t border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about ISS or News..."
                  className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
