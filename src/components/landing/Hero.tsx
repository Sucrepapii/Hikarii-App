import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Flame, Zap } from 'lucide-react';
import { Button } from '../common/Button';

export interface HeroProps {
  onGetStarted?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();

  const handleStart = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6 pt-[68px] pb-16 overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#080910] via-[#0D0F1C] to-[#0A0B16] pointer-events-none" />
      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
      {/* Subtle dot-grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 mb-8 animate-fade-in-up shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
          <span className="text-sm font-semibold text-primary-300 tracking-wide">
            Clarity. Focus. Control.
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-8 leading-[1.1] tracking-tight">
          The One Workspace Where{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
            Tasks Meet Budgets.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Stop managing tasks in one app and budgets in another. Hikarii connects your project
          tasks directly to your budget and spending in one visual view.
        </p>

        <div className="flex justify-center mb-6">
          <Button
            size="lg"
            className="w-full sm:w-auto px-10 py-6 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold text-lg shadow-xl shadow-primary-600/20"
            onClick={handleStart}
          >
            Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
        <p className="text-sm text-slate-500 font-medium mb-12">
          Connect every task to its budget – from small personal goals to full team projects.
        </p>

        {/* Floating social-proof pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up delay-300">
          {[
            { text: 'Productivity Meets Finance', icon: Sparkles, color: 'text-amber-400' },
            { text: 'The Hikarii Method', icon: Flame, color: 'text-orange-500' },
            { text: 'Free to start', icon: Zap, color: 'text-yellow-400' },
          ].map((pill) => (
            <span
              key={pill.text}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-400 bg-white/5 border border-white/[0.07] backdrop-blur-sm shadow-sm hover:bg-white/10 transition-colors cursor-default"
            >
              <pill.icon className={`w-3.5 h-3.5 ${pill.color}`} />
              {pill.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
