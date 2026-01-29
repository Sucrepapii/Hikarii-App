import React from 'react';
import { Insight } from '../../types/intelligence.types';
import { AlertTriangle, AlertCircle, Info, ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '../common/Button';


interface InsightCardProps {
    insight: Insight;
    onDismiss?: (id: string) => void;
    onAction?: (insight: Insight) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, onDismiss, onAction }) => {
    const getIcon = () => {
        switch (insight.priority) {
            case 'CRITICAL': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'HIGH': return <AlertCircle className="w-5 h-5 text-orange-500" />;
            case 'MEDIUM': return <Info className="w-5 h-5 text-blue-500" />;
            default: return <Info className="w-5 h-5 text-slate-500" />;
        }
    };

    const getBorderColor = () => {
        switch (insight.priority) {
            case 'CRITICAL': return 'border-l-4 border-l-red-500';
            case 'HIGH': return 'border-l-4 border-l-orange-500';
            case 'MEDIUM': return 'border-l-4 border-l-blue-500';
            default: return 'border-l-4 border-l-slate-300';
        }
    };

    return (
        <div className={`p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${getBorderColor()} hover:shadow-md transition-shadow`}>
            <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                            {insight.title}
                        </h4>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            {insight.type.replace('_', ' ')}
                        </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 mb-3">
                        {insight.message}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                        {insight.financialImpact !== undefined && insight.financialImpact !== 0 && (
                            <div className={`text-xs font-semibold flex items-center gap-1 ${insight.financialImpact > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {insight.financialImpact > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {insight.financialImpact > 0 ? '+' : ''}₦{Math.abs(insight.financialImpact).toLocaleString()}
                            </div>
                        )}

                        <div className="flex gap-2 ml-auto">
                            {insight.actionable && (
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-7 text-xs px-2"
                                    onClick={() => onAction && onAction(insight)}
                                >
                                    {insight.suggestedAction || 'Take Action'} <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
