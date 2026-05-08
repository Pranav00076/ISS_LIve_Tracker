import { useState, useEffect, useCallback, useRef } from "react";
import { askAI } from "../services/aiService";
import {
  buildAIPrompt,
  buildDashboardContext,
} from "../utils/dashboardContext";
import { Position } from "../utils/geo";
import { TavilyArticle } from "../services/tavilyService";
import toast from "react-hot-toast";

export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

const CHAT_STORAGE_KEY = "dashboard_chat_history";

export function useChatbot(
  currentPosition: Position | null,
  history: Position[],
  speed: number,
  astronauts: { name: string; craft: string }[],
  articles: TavilyArticle[],
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Track context dependencies to ensure fresh data is always available
  const contextDataRef = useRef({
    currentPosition,
    history,
    speed,
    astronauts,
    articles,
  });

  useEffect(() => {
    contextDataRef.current = {
      currentPosition,
      history,
      speed,
      astronauts,
      articles,
    };
  }, [currentPosition, history, speed, astronauts, articles]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load chat history");
    }
  }, []);

  // Save to local storage when messages change
  useEffect(() => {
    try {
      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(messages.slice(-30)),
      );
    } catch (e) {
      console.warn("Failed to save chat history");
    }
  }, [messages]);

  const toggleChat = () => setIsOpen((prev) => !prev);
  const closeChat = () => setIsOpen(false);
  const clearChat = () => setMessages([]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString() + "-user",
      role: "user",
      content: text.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const currentContextData = contextDataRef.current;
      const contextStr = buildDashboardContext(
        currentContextData.currentPosition,
        currentContextData.history,
        currentContextData.speed,
        currentContextData.astronauts,
        currentContextData.articles,
      );

      const prompt = buildAIPrompt(contextStr, text);
      const responseContent = await askAI(prompt);

      if (!responseContent) {
        throw new Error("Received empty response");
      }

      const aiMsg: Message = {
        id: Date.now().toString() + "-ai",
        role: "ai",
        content: responseContent.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error(
        "Failed to get answer: " + (error.message || "Network error"),
      );

      const errorMsg: Message = {
        id: Date.now().toString() + "-error",
        role: "ai",
        content:
          "Sorry, I couldn't reach the AI service right now. Please try again later.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  return {
    messages,
    isOpen,
    isTyping,
    toggleChat,
    closeChat,
    clearChat,
    sendMessage,
  };
}
