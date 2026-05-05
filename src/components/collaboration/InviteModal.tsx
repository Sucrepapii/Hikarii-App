import React, { useState } from 'react';
import { X, UserPlus, Mail, Shield } from 'lucide-react';
import { useCollaborationStore } from '../../stores/collaborationStore';
import { CollaborationRole } from '../../types/project.types';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';

interface InviteModalProps {
  projectId: string;
  projectTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_OPTIONS: { value: CollaborationRole; label: string; description: string }[] = [
  { value: 'VIEW_ONLY', label: 'View Only', description: 'Can see tasks, budgets, and comments' },
  { value: 'CAN_ADD_EXPENSES', label: 'Can Add Expenses', description: 'Can add expenses and post comments' },
  { value: 'CAN_EDIT', label: 'Can Edit', description: 'Can add/edit tasks, expenses, and comments' },
];

export const InviteModal: React.FC<InviteModalProps> = ({ projectId, projectTitle, isOpen, onClose }) => {
  const { inviteMember } = useCollaborationStore();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<CollaborationRole>('VIEW_ONLY');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await inviteMember(projectId, email.trim(), role);
      toast.success(`Invite sent to ${email}`);
      setEmail('');
      onClose();
    } catch (err: any) {
      const msg = err.message || 'Failed to send invite';
      if (msg.includes('UPGRADE_REQUIRED') || msg.includes('Upgrade to PRO')) {
        toast.error('Free plan allows 1 shared project. Upgrade to PRO for more.');
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-white/10 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">Invite Collaborator</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{projectTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <Mail className="w-4 h-4 inline mr-1.5" />Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <Shield className="w-4 h-4 inline mr-1.5" />Permission Level
            </label>
            <div className="space-y-2">
              {ROLE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    role === option.value
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                      : 'border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={role === option.value}
                    onChange={() => setRole(option.value)}
                    className="mt-0.5 accent-indigo-600"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-white">{option.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Button variant="primary" className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Sending Invite...' : 'Send Invite'}
          </Button>
        </form>
      </div>
    </div>
  );
};
