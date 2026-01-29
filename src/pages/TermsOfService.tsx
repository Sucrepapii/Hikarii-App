import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TermsOfService: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
                    Terms of Service
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                    Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            By accessing and using Hikari ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Description of Service</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            Hikari is a task management and budget tracking application that helps users organize their projects, track expenses, and manage their financial and productivity goals. The Service includes both free and premium subscription tiers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. User Accounts</h2>
                        <div className="space-y-4 text-slate-700 dark:text-slate-300">
                            <p>When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.</p>
                            <p>You are responsible for safeguarding the password and for all activities that occur under your account. You agree not to disclose your password to any third party.</p>
                            <p>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Subscription and Billing</h2>
                        <div className="space-y-4 text-slate-700 dark:text-slate-300">
                            <p><strong>Free Plan:</strong> Access to basic features with limitations on projects and task-expense linking.</p>
                            <p><strong>Pro Plan:</strong> Billed monthly ($8.99/month) or annually ($89/year). Includes unlimited projects, AI insights, advanced analytics, and priority support.</p>
                            <p>All fees are exclusive of applicable taxes unless otherwise stated. You are responsible for payment of all applicable taxes.</p>
                            <p>Subscriptions automatically renew unless canceled before the renewal date. You may cancel at any time through your account settings.</p>
                            <p>Refunds are provided at our discretion and evaluated on a case-by-case basis.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Acceptable Use</h2>
                        <div className="space-y-4 text-slate-700 dark:text-slate-300">
                            <p>You agree not to use the Service to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe upon the rights of others</li>
                                <li>Transmit any harmful, threatening, abusive, or defamatory content</li>
                                <li>Attempt to gain unauthorized access to the Service or related systems</li>
                                <li>Interfere with or disrupt the Service or servers</li>
                                <li>Use automated systems to access the Service without permission</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Intellectual Property</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            The Service and its original content, features, and functionality are owned by Hikari and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. User Content</h2>
                        <div className="space-y-4 text-slate-700 dark:text-slate-300">
                            <p>You retain all rights to any content you submit, post, or display on or through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, and publish your content solely for the purpose of providing the Service to you.</p>
                            <p>You are solely responsible for your content and the consequences of posting or publishing it.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Termination</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. Limitation of Liability</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            In no event shall Hikari, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">10. Disclaimer</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the Service, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">11. Changes to Terms</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. Continued use of the Service after changes constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">12. Contact Us</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            If you have any questions about these Terms, please contact us at{' '}
                            <a href="mailto:support@hikariapp.com" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                                support@hikariapp.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
