import React, { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import { MessageSquare, Trash2, Star, Clock } from 'lucide-react';
import apiClient from '../api/client';
import toast from 'react-hot-toast';

interface FeedbackItem {
    id: string;
    name: string;
    rating: number;
    comment: string;
    topic: string | null;
    country: string | null;
    createdAt: string;
}

export const AdminFeedback: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await apiClient.get('/feedback');
            setFeedbacks(response.data);
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
            toast.error('Failed to load feedback');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) return;
        
        try {
            await apiClient.delete(`/admin/feedback/${id}`);
            toast.success('Feedback deleted');
            setFeedbacks(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error('Failed to delete feedback:', error);
            toast.error('Failed to delete feedback');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">User Feedback</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage feedback submitted by users.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl font-medium">
                    <MessageSquare className="w-5 h-5" />
                    <span>{feedbacks.length} Responses</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {feedbacks.length === 0 ? (
                    <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
                        <MessageSquare className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No Feedback Yet</h3>
                        <p className="text-slate-500 max-w-sm mt-2">When users submit feedback through the platform, it will appear here.</p>
                    </Card>
                ) : (
                    feedbacks.map((feedback) => (
                        <Card key={feedback.id} className="p-6 overflow-hidden relative group transition-all hover:shadow-md">
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleDelete(feedback.id)}
                                    className="p-2 text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-lg transition-colors"
                                    title="Delete Feedback"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between md:justify-start gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                {feedback.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">{feedback.name}</h4>
                                                {feedback.topic && (
                                                    <span className="inline-block px-2 py-0.5 mt-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] rounded uppercase font-semibold tracking-wider">
                                                        {feedback.topic}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                            "{feedback.comment}"
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:w-48 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                                    <div className="flex flex-col items-start md:items-end">
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Rating</p>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-4 h-4 ${i < feedback.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'}`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(feedback.createdAt)}
                                        </div>
                                        {feedback.country && (
                                            <p className="text-xs text-slate-500 mt-1">{feedback.country}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};
