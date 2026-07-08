import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Sparkles, ChevronDown, MessageSquare } from 'lucide-react';
import apiClient from '../../api/client';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
}

const QUICK_PROMPTS = [
    "What is the Hikari Method?",
    "How does the budget feature work?"
];

export const FloatingChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Lead Capture State
    const [isIdentified, setIsIdentified] = useState(() => {
        return localStorage.getItem('hikari_chatbot_lead') === 'true';
    });
    const [leadName, setLeadName] = useState('');
    const [leadEmail, setLeadEmail] = useState('');
    const [isSubmittingLead, setIsSubmittingLead] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            sender: 'bot',
            text: "Hi! I'm Hikari Support. I can answer any general questions about the app, features, or the Hikari Method!",
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
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isLoading, isOpen]);

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
            const response = await apiClient.post('/predictive/support-bot', { query: textToSend });
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

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadEmail.includes('@') || !leadName.trim()) {
            toast.error("Please enter a valid name and email.");
            return;
        }

        setIsSubmittingLead(true);
        try {
            await apiClient.post('/leads', { 
                name: leadName, 
                email: leadEmail, 
                source: 'CHATBOT_LEAD' 
            });
            
            setIsIdentified(true);
            localStorage.setItem('hikari_chatbot_lead', 'true');
            
            // Personalize the welcome message if it hasn't been modified by a conversation yet
            if (messages.length === 1) {
                setMessages([{
                    id: 'welcome',
                    sender: 'bot',
                    text: `Hi ${leadName.split(' ')[0]}! I'm Hikari Support. How can I help you today?`,
                    timestamp: new Date()
                }]);
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmittingLead(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-primary-600 to-accent-600 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 transition-all z-[100]",
                    isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                )}
            >
                <MessageSquare className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Chatbot Window */}
            <div
                className={clsx(
                    "fixed bottom-6 right-6 w-96 h-[32rem] bg-white dark:bg-[#0D0F1A] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[100] transition-all duration-300 origin-bottom-right border border-slate-200 dark:border-slate-800",
                    isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-20 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-4 flex items-center justify-between text-white shadow-md relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold flex items-center gap-1.5 text-sm">
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Hikari AI
                            </h3>
                            <p className="text-[11px] text-white/80">Always here to help</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <ChevronDown className="w-5 h-5" />
                    </button>
                </div>

                {!isIdentified ? (
                    /* Lead Capture Form */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 text-center">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center mb-4">
                            <Bot className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Welcome to Hikari Support</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Before we begin, please introduce yourself.</p>
                        
                        <form onSubmit={handleLeadSubmit} className="w-full space-y-3">
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={leadName}
                                onChange={(e) => setLeadName(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                value={leadEmail}
                                onChange={(e) => setLeadEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                                type="submit"
                                disabled={isSubmittingLead}
                                className="w-full px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors flex justify-center items-center gap-2"
                            >
                                {isSubmittingLead ? "Loading..." : "Start Chatting"} <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Chat Interface */
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={clsx(
                                        "flex items-start gap-2 max-w-[85%] transition-all",
                                        msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}
                                >
                                    <div className={clsx(
                                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm border text-[10px]",
                                        msg.sender === 'user'
                                            ? "bg-slate-200 border-slate-300 text-slate-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                                            : "bg-primary-100 border-primary-200 text-primary-600 dark:bg-primary-900/50 dark:border-primary-800"
                                    )}>
                                        {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                    </div>

                                    <div className={clsx(
                                        "p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm whitespace-pre-line",
                                        msg.sender === 'user'
                                            ? "bg-primary-600 text-white rounded-tr-none"
                                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none"
                                    )}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-start gap-2 mr-auto max-w-[85%]">
                                    <div className="w-7 h-7 rounded-full bg-primary-100 border border-primary-200 text-primary-600 flex items-center justify-center shrink-0">
                                        <Bot className="w-3.5 h-3.5 animate-bounce" />
                                    </div>
                                    <div className="p-3 rounded-2xl rounded-tl-none bg-white border border-slate-100 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-primary-500 animate-bounce delay-[100ms]" />
                                        <span className="w-1 h-1 rounded-full bg-primary-500 animate-bounce delay-[200ms]" />
                                        <span className="w-1 h-1 rounded-full bg-primary-500 animate-bounce delay-[300ms]" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {messages.length === 1 && (
                            <div className="px-3 py-2 flex flex-wrap gap-1.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0D0F1A]">
                                {QUICK_PROMPTS.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSendMessage(prompt)}
                                        className="px-2.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 text-[11px] font-medium text-slate-600 dark:text-slate-400 transition-colors text-left"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0D0F1A]">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage(input);
                                }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    placeholder="Ask Hikari..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isLoading}
                                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors flex items-center justify-center shrink-0 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
