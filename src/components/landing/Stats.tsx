import React from 'react';

export interface StatItem {
    value: string;
    label: string;
}

export const STATS: StatItem[] = [
    { value: "1K+", label: "Active Users" },
    { value: "92%", label: "Feel More in Control" },
    { value: "$1.2M", label: "Budgets Managed" },
    { value: "4.9★", label: "Average Rating" },
];

export const Stats: React.FC = () => {
    return (
        <div className="border-y border-white/[0.06] bg-[#0D0F1A] py-10">
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                {STATS.map((s) => (
                    <div key={s.label} className="text-center">
                        <div className="text-3xl font-extrabold text-white tracking-tight mb-1">{s.value}</div>
                        <div className="text-sm text-slate-400 font-medium">{s.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Stats;
