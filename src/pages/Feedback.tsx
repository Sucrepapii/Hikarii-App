import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FeedbackSection } from '../components/common/FeedbackSection';
import { Logo } from '../components/common/Logo';
import { Footer } from '../components/layout/Footer';

export const Feedback = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-purple-100 dark:from-[#0B0C15] dark:via-[#111322] dark:to-[#0B0C15] font-sans text-slate-900 dark:text-slate-100">
            {/* Simple Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0B0C15]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Logo variant="full" size="md" suppressLink={true} />
                    </div>
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                </div>
            </nav>

            <div className="pt-32 pb-20">
                <FeedbackSection />
            </div>
            
            <Footer />
        </div>
    );
};
