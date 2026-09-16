import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useAuthStore } from '../stores/authStore';
import { LoadingScreen } from '../components/common/LoadingScreen';
import toast from 'react-hot-toast';

export const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const [statusText, setStatusText] = useState('Finalizing your sign in...');

    useEffect(() => {
        let isMounted = true;

        const processAuthCallback = async () => {
            try {
                // Check if URL hash or search params contain errors
                const hash = window.location.hash;
                if (hash.includes('error=')) {
                    const params = new URLSearchParams(hash.replace('#', '?'));
                    const errorDesc = params.get('error_description') || 'Authentication failed';
                    toast.error(decodeURIComponent(errorDesc.replace(/\+/g, ' ')));
                    navigate('/login', { replace: true });
                    return;
                }

                // Retrieve session initialized by Supabase from hash/code
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    throw error;
                }

                if (session) {
                    setStatusText('Syncing user profile...');
                    await checkAuth();
                    if (isMounted) {
                        toast.success('Email confirmed! Welcome to Hikarii.');
                        const redirectTo = searchParams.get('redirect') || '/dashboard';
                        navigate(redirectTo, { replace: true });
                    }
                } else {
                    // Subscribe to state change in case session processing is in-flight
                    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
                        if (currentSession && isMounted) {
                            subscription.unsubscribe();
                            setStatusText('Syncing user profile...');
                            await checkAuth();
                            toast.success('Email confirmed! Welcome to Hikarii.');
                            const redirectTo = searchParams.get('redirect') || '/dashboard';
                            navigate(redirectTo, { replace: true });
                        }
                    });


                }
            } catch (err: any) {
                console.error('[Auth Callback Error]:', err);
                if (isMounted) {
                    toast.error(err.message || 'Authentication callback failed');
                    navigate('/login', { replace: true });
                }
            }
        };

        processAuthCallback();

        return () => {
            isMounted = false;
        };
    }, [checkAuth, navigate, searchParams]);

    return <LoadingScreen />;
};
