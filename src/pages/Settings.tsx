import React from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { TaskArchive } from '../components/settings/TaskArchive';
import { ProjectArchive } from '../components/settings/ProjectArchive';
import { ProfileTab } from '../components/settings/ProfileTab';
import { DataManagementTab } from '../components/settings/DataManagementTab';
import { CurrencyTab } from '../components/settings/CurrencyTab';
import { IntegrationsTab } from '../components/settings/IntegrationsTab';
import { SupportTab } from '../components/settings/SupportTab';

type TabId = 'data' | 'currency' | 'profile' | 'integrations' | 'support' | 'archive';

export const Settings: React.FC = () => {
    const [searchParams] = useSearchParams();
    const activeTab = (searchParams.get('tab') as TabId) || 'profile';
    const [isGoogleConnected, setIsGoogleConnected] = React.useState(false);

    // Check Google Status
    React.useEffect(() => {
        apiClient.get('/google/status')
            .then(res => setIsGoogleConnected(res.data.isConnected))
            .catch(err => console.error(err));
    }, []);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await apiClient.post('/google/connect', { code: tokenResponse.code });
                if (res.data.success) {
                    setIsGoogleConnected(true);
                    toast.success("Connected to Google Calendar!");
                }
            } catch (error: any) {
                console.error("Google connect error", error);
                toast.error("Failed to connect Google Calendar.");
            }
        },
        onError: () => toast.error("Google Login Failed"),
        flow: 'auth-code',
        scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"
    });

    const handleDisconnectGoogle = async () => {
        try {
            await apiClient.post('/google/disconnect');
            setIsGoogleConnected(false);
            toast.success("Disconnected from Google Calendar");
        } catch (_error) {
            toast.error("Failed to disconnect");
        }
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                    Settings
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Manage your preferences and account
                </p>
            </div>

            <div className="space-y-6">
                {activeTab === 'profile' && <ProfileTab />}
                {activeTab === 'data' && <DataManagementTab />}
                {activeTab === 'currency' && <CurrencyTab />}
                {activeTab === 'integrations' && (
                    <IntegrationsTab
                        isGoogleConnected={isGoogleConnected}
                        onDisconnectGoogle={handleDisconnectGoogle}
                        onGoogleLogin={() => googleLogin()}
                    />
                )}
                {activeTab === 'support' && <SupportTab />}
                {activeTab === 'archive' && (
                    <div className="space-y-8">
                        <TaskArchive />
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-8" />
                        <ProjectArchive />
                    </div>
                )}
            </div>
        </div>
    );
};
