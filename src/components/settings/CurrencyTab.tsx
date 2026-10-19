import React from 'react';
import { Card } from '../common/Card';
import { DollarSign } from 'lucide-react';
import { useBudgetStore } from '../../stores/budgetStore';

const CURRENCIES = ['NGN', 'USD', 'GBP', 'EUR', 'CAD'];

export const CurrencyTab: React.FC = () => {
    const { currency, setCurrency } = useBudgetStore();

    return (
        <Card>
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                        Currency Preferences
                    </h2>
                    <p className="text-sm text-slate-500">
                        Select your preferred display currency
                    </p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Display Currency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CURRENCIES.map((code) => (
                        <button
                            key={code}
                            type="button"
                            onClick={() => setCurrency(code)}
                            className={`
                                p-3 rounded-xl border font-medium transition-all
                                ${currency === code
                                    ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300'}
                            `}
                        >
                            {code}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Note: Exchange rates are estimated (Base: NGN).
                </p>
            </div>
        </Card>
    );
};
