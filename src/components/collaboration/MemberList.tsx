import React, { useState } from 'react';
import { Trash2, ChevronDown } from 'lucide-react';
import { ProjectMember, CollaborationRole } from '../../types/project.types';
import { useCollaborationStore } from '../../stores/collaborationStore';
import { Button } from '../common/Button';
import { ConfirmModal } from '../common/ConfirmModal';
import toast from 'react-hot-toast';

interface MemberListProps {
  projectId: string;
  members: ProjectMember[];
  currentUserId: string;
  isOwner: boolean;
}

const ROLE_LABELS: Record<CollaborationRole, string> = {
  VIEW_ONLY: 'View Only',
  CAN_ADD_EXPENSES: 'Can Add Expenses',
  CAN_EDIT: 'Can Edit',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  ACCEPTED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  DECLINED: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

function getInitials(name?: string, email?: string): string {
  if (name) return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  if (email) return email.slice(0, 2).toUpperCase();
  return '??';
}

export const MemberList: React.FC<MemberListProps> = ({ projectId, members, currentUserId, isOwner }) => {
  const { updateMemberRole, removeMember } = useCollaborationStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; email: string } | null>(null);

  const handleRoleChange = async (memberId: string, role: CollaborationRole) => {
    setLoadingId(memberId);
    try {
      await updateMemberRole(projectId, memberId, role);
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemove = async () => {
    if (!memberToRemove) return;
    const { id, email } = memberToRemove;
    setLoadingId(id);
    try {
      await removeMember(projectId, id);
      toast.success('Member removed');
      setMemberToRemove(null);
    } catch {
      toast.error('Failed to remove member');
    } finally {
      setLoadingId(null);
    }
  };

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        No collaborators yet. Invite someone to get started!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const displayName = member.user?.name || member.invitedEmail;
        const initials = getInitials(member.user?.name, member.invitedEmail);
        const isCurrentUser = member.userId === currentUserId;
        const isLoading = loadingId === member.id;

        return (
          <div
            key={member.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                {displayName}{isCurrentUser && <span className="ml-1 text-xs text-primary-500">(you)</span>}
              </div>
              <div className="text-xs text-slate-400 truncate">{member.invitedEmail}</div>
            </div>

            {/* Status badge */}
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[member.status]}`}>
              {member.status === 'PENDING' ? 'Pending' : ROLE_LABELS[member.role]}
            </span>

            {/* Owner controls */}
            {isOwner && member.status === 'ACCEPTED' && (
              <div className="relative">
                <select
                  value={member.role}
                  disabled={isLoading}
                  onChange={(e) => handleRoleChange(member.id, e.target.value as CollaborationRole)}
                  className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 pr-6 appearance-none"
                >
                  {Object.entries(ROLE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>
            )}

            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMemberToRemove({ id: member.id, email: member.invitedEmail })}
                disabled={isLoading}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        );
      })}

      <ConfirmModal
        isOpen={!!memberToRemove}
        onClose={() => !loadingId && setMemberToRemove(null)}
        onConfirm={handleRemove}
        title="Remove Member"
        message={`Are you sure you want to remove ${memberToRemove?.email} from this project? They will lose all access immediately.`}
        confirmText="Remove Member"
        variant="danger"
        isLoading={!!loadingId}
      />
    </div>
  );
};
