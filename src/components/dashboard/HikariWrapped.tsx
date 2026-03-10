import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, Sparkles, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '../common/Button';
import { Logo } from '../common/Logo';
import apiClient from '../../api/client';

interface WrappedData {
    totalTasksList: number;
    totalCompleted: number;
    topDay: string;
    topDayCount: number;
    totalIncome: number;
    deadWeightCut: number;
    archetype: string;
    month: string;
    year: number;
}

interface HikariWrappedProps {
    onClose: () => void;
}

const STORY_DURATION_MS = 6000;

export const HikariWrapped: React.FC<HikariWrappedProps> = ({ onClose }) => {
    const [data, setData] = useState<WrappedData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const [progress, setProgress] = useState(0);

    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    const totalSlides = 4; // Intro, Productivity, Finance, Archetype Summary

    useEffect(() => {
        // Fetch user data for the wrap
        const fetchWrappedData = async () => {
            try {
                const res = await apiClient.get('/insights/wrapped');
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch wrapped data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWrappedData();
    }, []);

    // Story progression logic
    useEffect(() => {
        if (loading || !data) return;

        const animateProgress = () => {
            const now = Date.now();
            const elapsed = now - startTimeRef.current;
            const newProgress = Math.min((elapsed / STORY_DURATION_MS) * 100, 100);

            setProgress(newProgress);

            if (elapsed >= STORY_DURATION_MS) {
                handleNextSlide();
            } else {
                timerRef.current = requestAnimationFrame(animateProgress) as any;
            }
        };

        startTimeRef.current = Date.now();
        setProgress(0);
        timerRef.current = requestAnimationFrame(animateProgress) as any;

        return () => {
            if (timerRef.current) cancelAnimationFrame(timerRef.current as any);
        };
    }, [activeSlide, loading, data]);

    const handleNextSlide = () => {
        if (activeSlide < totalSlides - 1) {
            setActiveSlide(prev => prev + 1);
        } else {
            // Pause on last slide instead of closing
            if (timerRef.current) cancelAnimationFrame(timerRef.current as any);
            setProgress(100);
        }
    };

    const handlePrevSlide = () => {
        if (activeSlide > 0) {
            setActiveSlide(prev => prev - 1);
        }
    };

    const handleTap = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x > rect.width / 2) {
            handleNextSlide();
        } else {
            handlePrevSlide();
        }
    };


    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] bg-[#0B0C15] flex flex-col items-center justify-center animate-pulse">
                <Logo variant="icon" size="lg" className="mb-4" />
                <div className="text-white text-xl font-bold tracking-widest uppercase">Calculating Your Impact...</div>
            </div>
        );
    }

    if (!data) return null;


    const SlideIndicator = () => (
        <div className="flex gap-2 w-full px-4 pt-12 absolute top-0 z-50">
            {Array.from({ length: totalSlides }).map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white transition-all ease-linear"
                        style={{
                            width: i === activeSlide ? `${progress}%` : (i < activeSlide ? '100%' : '0%'),
                            transitionDuration: i === activeSlide ? '0ms' : '300ms'
                        }}
                    />
                </div>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] bg-black text-white overflow-hidden flex justify-center selection:bg-purple-500/30">

            {/* Background ambient light - changes per slide */}
            <div className="absolute inset-0 z-0">
                <div className={`w-full h-full absolute transition-opacity duration-1000 ${activeSlide === 0 ? 'opacity-100' : 'opacity-0'} bg-gradient-to-b from-indigo-900 via-black to-black`} />
                <div className={`w-full h-full absolute transition-opacity duration-1000 ${activeSlide === 1 ? 'opacity-100' : 'opacity-0'} bg-gradient-to-b from-fuchsia-900 via-black to-black`} />
                <div className={`w-full h-full absolute transition-opacity duration-1000 ${activeSlide === 2 ? 'opacity-100' : 'opacity-0'} bg-gradient-to-b from-emerald-900 via-black to-black`} />
                <div className={`w-full h-full absolute transition-opacity duration-1000 ${activeSlide === 3 ? 'opacity-100' : 'opacity-0'} bg-gradient-to-b from-purple-900 via-[#11052C] to-black`} />
            </div>

            {/* Floating gradient orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-pulse" />

            {/* Mobile-sized container centered on desktop */}
            <div className="relative w-full max-w-md h-full bg-transparent flex flex-col z-10 shadow-2xl">
                <SlideIndicator />

                {/* Close button */}
                <button onClick={onClose} className="absolute top-16 right-4 z-50 p-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                    <X className="w-6 h-6 text-white" />
                </button>

                {/* Tap Areas */}
                <div className="absolute inset-0 z-40" onClick={handleTap} />

                {/* === SLIDE 1: INTRO & VOLUME === */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-all duration-700 ${activeSlide === 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                    <Logo variant="icon" size="xl" className="mb-8 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-bounce-slow" />
                    <h2 className="text-2xl font-medium text-indigo-300 mb-2 uppercase tracking-widest">Your {data.month}</h2>
                    <h1 className="text-6xl font-display font-bold mb-8 leading-tight">By the <br /><span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Numbers</span></h1>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl w-full">
                        <div className="flex justify-center mb-4"><Zap className="w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" /></div>
                        <div className="text-6xl font-bold text-white mb-2">{data.totalCompleted}</div>
                        <div className="text-lg text-slate-300 font-medium tracking-wide">Tasks Completed</div>
                    </div>
                    <p className="mt-8 text-xl text-indigo-200 font-medium">You were absolutely ruthless.</p>
                </div>

                {/* === SLIDE 2: TIME INSIGHT === */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-all duration-700 ${activeSlide === 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                    <Calendar className="w-16 h-16 text-fuchsia-400 mb-8 drop-shadow-[0_0_20px_rgba(232,121,249,0.5)]" />
                    <h2 className="text-3xl font-display font-medium text-white mb-4">But you had a secret weapon...</h2>
                    <p className="text-xl text-fuchsia-200 mb-12">There was one day of the week you refused to lose.</p>

                    <div className="relative">
                        <div className="absolute inset-0 bg-fuchsia-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                        <h1 className="relative text-7xl font-display font-bold text-white mb-2 drop-shadow-2xl z-10">{data.topDay}s.</h1>
                    </div>
                    <p className="mt-8 text-lg text-slate-300">You crushed <span className="text-white font-bold">{data.topDayCount} items</span> on this day alone.</p>
                </div>

                {/* === SLIDE 3: FINANCIAL FLEX === */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-all duration-700 ${activeSlide === 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                    <TrendingUp className="w-16 h-16 text-emerald-400 mb-8 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
                    <h2 className="text-3xl font-display font-bold text-white mb-12">Productivity = Profit.</h2>

                    <div className="flex flex-col gap-6 w-full">
                        <div className="bg-emerald-900/40 backdrop-blur-md border border-emerald-500/30 p-6 rounded-3xl w-full transform -rotate-2">
                            <div className="text-sm uppercase tracking-widest text-emerald-300 font-bold mb-2">Income Linked</div>
                            <div className="text-5xl font-bold text-white">NGN {data.totalIncome.toLocaleString()}</div>
                        </div>

                        {data.deadWeightCut > 0 && (
                            <div className="bg-red-900/40 backdrop-blur-md border border-red-500/30 p-6 rounded-3xl w-full transform rotate-2">
                                <div className="text-sm uppercase tracking-widest text-red-300 font-bold mb-2">Dead Subscriptions Cut</div>
                                <div className="text-4xl font-bold text-white">NGN {data.deadWeightCut.toLocaleString()}</div>
                            </div>
                        )}
                    </div>
                    <p className="mt-10 text-xl text-emerald-100">Your focus is literally paying off.</p>
                </div>

                {/* === SLIDE 4: THE ARCHETYPE (SHAREABLE CARD) === */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-all duration-700 ${activeSlide === 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>

                    <h2 className="text-2xl font-medium text-purple-300 mb-6 drop-shadow-lg z-50">So, what's your vibe?</h2>

                    {/* The Shareable Card Component */}
                    <div className="relative bg-[#11052C] border border-purple-500/40 rounded-[2.5rem] p-8 w-full shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden group z-50">
                        {/* Card Background Effects */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px]" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px]" />

                        <Logo variant="full" size="sm" className="absolute top-6 left-6 opacity-50" />

                        <div className="mt-12 mb-6">
                            <Trophy className="w-12 h-12 text-yellow-400 mx-auto drop-shadow-lg mb-4" />
                            <div className="text-sm text-purple-300 font-medium tracking-widest uppercase mb-1">{data.month} {data.year} Archetype</div>
                            <div className="text-4xl font-display font-bold text-white bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text">
                                {data.archetype}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8 pb-4 border-b border-white/10">
                            <div className="text-left">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Tasks</div>
                                <div className="text-2xl font-bold text-white">{data.totalCompleted}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Generated</div>
                                <div className="text-2xl font-bold text-emerald-400">${(data.totalIncome / 1500).toFixed(0)}</div>
                            </div>
                        </div>

                        <div className="text-xs text-slate-500 mt-4 text-center">Organized via Hikari</div>
                    </div>

                    <div className="mt-12 flex flex-col gap-4 w-full z-50 relative">
                        <Button
                            className="w-full h-14 bg-white text-black hover:bg-slate-200 rounded-full text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            onClick={() => {
                                alert("In a real app, this would use the browser Web Share API or html2canvas to generate an image for Instagram!");
                            }}
                        >
                            Share My Month <Sparkles className="w-5 h-5 ml-2" />
                        </Button>
                        <button onClick={onClose} className="text-slate-400 font-medium hover:text-white transition-colors">
                            Close
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
