import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { GoogleIcon } from '../icons/GoogleIcon';

interface IntegrationsTabProps {
    isGoogleConnected: boolean;
    onDisconnectGoogle: () => void;
    onGoogleLogin: () => void;
}

export const IntegrationsTab: React.FC<IntegrationsTabProps> = ({
    isGoogleConnected,
    onDisconnectGoogle,
    onGoogleLogin,
}) => {
    return (
        <Card>
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                        Integrations
                    </h2>
                    <p className="text-sm text-slate-500">
                        Connect with third-party tools
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div>
                        <h3 className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            Google Calendar
                            {isGoogleConnected && <span className="text-xs text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Connected</span>}
                        </h3>
                        <p className="text-sm text-slate-500">
                            Sync individual tasks to Google Calendar (optional per task).
                        </p>
                    </div>
                    {isGoogleConnected ? (
                        <Button
                            variant="danger"
                            onClick={onDisconnectGoogle}
                            className="w-full sm:w-auto"
                        >
                            Disconnect
                        </Button>
                    ) : (
                        <button
                            onClick={onGoogleLogin}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm whitespace-nowrap touch-manipulation"
                        >
                            <GoogleIcon className="w-5 h-5" />
                            <span>Connect Google Calendar</span>
                        </button>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 opacity-60">
                    <div>
                        <h3 className="font-medium text-slate-400 dark:text-slate-500 flex items-center gap-2">
                            WhatsApp Business
                            <span className="text-[10px] uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">Coming Soon</span>
                        </h3>
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            Direct integration with WhatsApp Business API for advanced features.
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        disabled
                        className="w-full sm:w-auto"
                    >
                        Connect
                    </Button>
                </div>
            </div>
        </Card>
    );
};
export default IntegrationsTab;
