import React, { useEffect, useRef, useState } from 'react';
import { Send, Trash2, MessageSquare } from 'lucide-react';
import { useCollaborationStore } from '../../stores/collaborationStore';
import { supabase } from '../../supabase/client';
import toast from 'react-hot-toast';

interface ActivityLogProps {
  projectId: string;
  currentUserId: string;
}

function getInitials(name?: string): string {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ projectId, currentUserId }) => {
  const { comments, isCommentsLoading, fetchComments, postComment, deleteComment, markActivityAsRead } = useCollaborationStore();
  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchComments(projectId);
    markActivityAsRead(projectId); // Mark as read when opening

    // Subscribe to real-time updates for ProjectComment events
    const channel = supabase
      .channel(`project-comments-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ProjectComment',
          filter: `projectId=eq.${projectId}`
        },
        () => {
          fetchComments(projectId);
          markActivityAsRead(projectId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, fetchComments, markActivityAsRead]);

  useEffect(() => {
    // Only scroll if we were already at the bottom or if it's the initial load
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments.length]); // Use length to avoid scrolling on every poll if content is same

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsPosting(true);
    try {
      await postComment(projectId, newComment.trim());
      setNewComment('');
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(projectId, commentId);
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-primary-500" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Activity & Comments</span>
        <span className="ml-auto text-xs text-slate-400">{comments.length} messages</span>
      </div>

      {/* Comments list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0 max-h-80">
        {isCommentsLoading ? (
          <div className="text-center py-6 text-slate-400 text-sm">Loading activity...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No comments yet. Start the conversation!
          </div>
        ) : (
          comments.map((comment) => {
            const isMe = comment.userId === currentUserId;
            const initials = getInitials(comment.user?.name);
            return (
              <div key={comment.id} className={`flex gap-2.5 group ${isMe ? 'flex-row-reverse' : ''}`}>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  {initials}
                </div>
                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                  <div className="flex items-center gap-2">
                    {!isMe && <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{comment.user?.name}</span>}
                    <span className="text-xs text-slate-400">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-tr-sm'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                    }`}>
                      {comment.content}
                    </div>
                    {isMe && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handlePost} className="flex gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={!newComment.trim() || isPosting}
          className="w-9 h-9 shrink-0 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 disabled:bg-slate-300 dark:disabled:bg-white/10 text-white rounded-xl flex items-center justify-center transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
