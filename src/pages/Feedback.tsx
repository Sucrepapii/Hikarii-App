import { useNavigate } from 'react-router-dom';
import { FeedbackSection } from '../components/common/FeedbackSection';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';

export const Feedback = () => {
    return (
        <div className="min-h-screen bg-[#080910] font-sans text-slate-100 flex flex-col selection:bg-purple-500/30 overflow-x-hidden deep-dark">
            <Navbar />

            <div className="flex-grow pt-32 pb-20 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
                <FeedbackSection />
            </div>
            
            <Footer />
        </div>
    );
};
