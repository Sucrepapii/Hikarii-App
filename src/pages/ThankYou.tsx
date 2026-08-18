import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';

export function ThankYou() {
  return (
    <div className="min-h-screen bg-[#060814] flex flex-col items-center justify-center p-6 text-white text-center">
      <Helmet>
        <title>Thank You - Task Budget App</title>
        <meta name="description" content="Thank you for your action." />
      </Helmet>
      
      <div className="mb-8">
        <Logo />
      </div>

      <div className="bg-[#0D0F1A] border border-white/10 rounded-2xl p-8 md:p-12 max-w-lg w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-emerald-500" />
        
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        
        <h1 className="text-3xl font-display font-bold mb-4">Thank You!</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Your request has been successfully processed. We appreciate you taking the time to connect with us.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="secondary" 
            onClick={() => window.location.href = '/'}
            className="flex-1"
          >
            <Home className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          <Button 
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1 bg-primary-600 hover:bg-primary-500"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
