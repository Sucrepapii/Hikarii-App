import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const SupportTab: React.FC = () => {
    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                        <h3 className="font-medium text-slate-800 dark:text-white">Is Hikarii really free?</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Yes, the core features are free forever. Pro offers advanced AI and unlimited history.
                        </p>
                    </div>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                        <h3 className="font-medium text-slate-800 dark:text-white">How do I export my data?</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Go to the Data Management tab in settings to download CSV files.
                        </p>
                    </div>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                        <h3 className="font-medium text-slate-800 dark:text-white">Can I share my plan?</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Currently, plans are for individual users only.
                        </p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                            Need more help?
                        </h2>
                        <p className="text-slate-500">Our support team is always ready to help you.</p>
                    </div>
                    <Button onClick={() => window.location.href = '/contact'} variant="primary">
                        Contact Us
                    </Button>
                </div>
            </Card>
        </div>
    );
};
