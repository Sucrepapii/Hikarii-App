
import React from 'react';
import { ForecastResult } from '../../types/budget.types';
import { Card } from '../common/Card';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { useBudgetStore } from '../../stores/budgetStore';

interface BudgetProjectionProps {
    forecasts: ForecastResult[];
    currency?: string;
}

export const BudgetProjection: React.FC<BudgetProjectionProps> = ({ forecasts, currency = 'NGN' }) => {
    if (forecasts.length === 0) return null;

    // Filter to show only warnings/critical or high spend
    // showing all might be cluttered, let's show top 3 mostly at risk
    const atRisk = forecasts
        .filter(f => f.status !== 'SAFE' || (f.currentSpent / f.budgetLimit) > 0.7)
        .sort((a, b) => b.projectedTotal / b.budgetLimit - a.projectedTotal / a.budgetLimit);

    if (atRisk.length === 0) return null;

    return (
        <Card className="border-l-4 border-l-primary-500">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                End of Month Projections
            </h3>

            <div className="space-y-4">
                {atRisk.map(forecast => {
                    const percentage = Math.min((forecast.projectedTotal / forecast.budgetLimit) * 100, 100);
                    const isOver = forecast.projectedTotal > forecast.budgetLimit;

                    return (
                        <div key={forecast.category} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                    {forecast.category}
                                </span>
                                <span className={clsx(
                                    "font-bold text-xs sm:text-sm md:text-base break-all",
                                    isOver ? "text-red-500" : "text-amber-500"
                                )}>
                                    Est. {currency}{useBudgetStore.getState().getConvertedAmount(forecast.projectedTotal, currency).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                            </div>

                            {/* Progress Bar Container */}
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
                                {/* Current Spend */}
                                <div
                                    className="absolute h-full bg-slate-400 dark:bg-slate-500 rounded-full z-10"
                                    style={{ width: `${Math.min((forecast.currentSpent / forecast.budgetLimit) * 100, 100)}%` }}
                                />
                                {/* Projected Extension */}
                                <div
                                    className={clsx(
                                        "absolute h-full rounded-full transition-all duration-500",
                                        isOver ? "bg-red-500" : "bg-amber-400"
                                    )}
                                    style={{ width: `${percentage}%` }}
                                />

                                {/* Budget Limit Marker */}
                                <div className="absolute top-0 bottom-0 w-0.5 bg-black dark:bg-white right-0 z-20 opacity-30" style={{ left: '100%' }} />
                            </div>

                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Limit: {currency}{useBudgetStore.getState().getConvertedAmount(forecast.budgetLimit, currency).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                {isOver && (
                                    <span className="flex items-center gap-1 text-red-500 font-medium">
                                        <AlertTriangle className="w-3 h-3" /> Projected Overspend
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-center text-slate-400 mt-4">
                Based on your daily spending habits and known subscriptions.
            </p>
        </Card>
    );
};
