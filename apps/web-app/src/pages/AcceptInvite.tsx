import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collaborationService } from '../services/collaboration.service';
import { Button } from '../components/common/Button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AcceptInvite: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleAccept = async () => {
      if (!token) return;
      try {
        await collaborationService.acceptInvite(token);
        setStatus('success');
        toast.success('Invitation accepted! Welcome to the project.');
        setTimeout(() => navigate('/projects'), 3000);
      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err.response?.data?.error || 'Failed to accept invitation');
      }
    };

    handleAccept();
  }, [token, navigate]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-white/5 animate-fade-in-up">
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Accepting Invitation...</h1>
            <p className="text-slate-500">Please wait while we process your request.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invitation Accepted!</h1>
            <p className="text-slate-500">You now have access to the shared project. Redirecting you to your projects list...</p>
            <Button variant="primary" onClick={() => navigate('/projects')} className="w-full">
              Go to Projects Now
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Oops!</h1>
            <p className="text-slate-500">{errorMsg}</p>
            <Button variant="secondary" onClick={() => navigate('/projects')} className="w-full">
              Back to Projects
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
