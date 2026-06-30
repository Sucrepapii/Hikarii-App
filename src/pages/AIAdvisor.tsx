import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/common/Card';
import { Send, Bot, User, Sparkles, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';
import apiClient from '../api/client';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
}

const QUICK_PROMPTS = [
    "Can I afford to go out for dinner tonight?",
    "Why is my budget tight this month?",
    "What tasks should I prioritize to avoid late fees?",
    "Give me a summary of my financial and task health."
];

export const AIAdvisor: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            sender: 'bot',
            text: "Hello! I am Hikari, your AI productivity & financial coach. I have loaded your active tasks and budgets to give you radical clarity. Ask me anything about your cash flow, upcoming bills, or task prioritization!",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async (textToSend: string) => {
        if (!textToSend.trim() || isLoading) return;

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: textToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await apiClient.post('/predictive/coach', { query: textToSend });
            const botMsg: Message = {
                id: `bot-${Date.now()}`,
                sender: 'bot',
                text: response.data.reply || "I couldn't process that, please try again.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error: any) {
            console.error("AI Coach Error:", error);
            const errMsg = error.response?.data?.error || "Connection issues with Hikari AI. Please check your setup.";
            toast.error(errMsg);
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    sender: 'bot',
                    text: `⚠️ System Error: ${errMsg}`,
                    timestamp: new Date()
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto px-4 pb-4 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 mt-2">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-7 h-7 text-cyan-500 animate-pulse" />
                        AI Advisor
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Conversational coach for radical clarity in time & money.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Gemini Core Connected</span>
                </div>
            </div>

            {/* Chat Body */}
            <Card className="flex-1 flex flex-col p-0 overflow-hidden bg-white/70 dark:bg-[#0D0F1A] border-slate-200/50 dark:border-white/5 backdrop-blur-xl relative">
                {/* Visual Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

                {/* Messages Viewport */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 relative z-10">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={clsx(
                                "flex items-start gap-4 max-w-[85%] transition-all",
                                msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            {/* Avatar */}
                            <div className={clsx(
                                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border",
                                msg.sender === 'user'
                                    ? "bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                                    : "bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400"
                            )}>
                                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>

                            {/* Bubble */}
                            <div className={clsx(
                                "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm",
                                msg.sender === 'user'
                                    ? "bg-cyan-600 text-white font-medium rounded-tr-none"
                                    : "bg-slate-50 dark:bg-white/[0.03] text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-white/[0.05] rounded-tl-none"
                            )}>
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {/* Loader */}
                    {isLoading && (
                        <div className="flex items-start gap-4 mr-auto max-w-[85%]">
                            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4 animate-bounce" />
                            </div>
                            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce delay-[100ms]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce delay-[200ms]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce delay-[300ms]" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggestions / Prompt chips */}
                {messages.length === 1 && (
                    <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-2 gap-2 relative z-10 border-t border-slate-100 dark:border-white/[0.02] bg-slate-50/50 dark:bg-black/10">
                        {QUICK_PROMPTS.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(prompt)}
                                className="text-left p-3 rounded-xl border border-slate-200/60 dark:border-white/5 bg-white/50 dark:bg-slate-900/30 hover:bg-cyan-500/5 hover:border-cyan-500/20 text-xs font-medium text-slate-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-all flex items-center gap-2"
                            >
                                <HelpCircle className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                                <span className="truncate">{prompt}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Container */}
                <div className="p-4 border-t border-slate-100 dark:border-white/5 relative z-10 bg-white/90 dark:bg-[#0D0F1A]">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage(input);
                        }}
                        className="flex gap-2"
                    >
                        <input
                            type="text"
                            placeholder="Ask Hikari about budgets, task priority, or savings..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-600/10 disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </Card>
        </div>
    );
};
