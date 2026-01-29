import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
                    Privacy Policy
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                    Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Introduction</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            Hikari ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our task management and budget tracking service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Information We Collect</h2>
                        <div className="space-y-4 text-slate-700 dark:text-slate-300">
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Personal Information</h3>
                                <p>When you register for an account, we collect:</p>
                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>Name</li>
                                    <li>Email address</li>
                                    <li>Password (encrypted)</li>
                                    <li>Payment information (processed securely through Stripe)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Usage Data</h3>
                                <p>We automatically collect certain information when you use the Service:</p>
                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>Tasks, projects, and budget entries you create</li>
                                    <li>Device information (browser type, operating system)</li>
                                    <li>IP address and general location data</li>
                                    <li>Usage patterns and preferences</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. How We Use Your Information</h2>
                        <div className="space-y-4 text-slate-700 dark:text-slate-300">
                            <p>We use the information we collect to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide, operate, and maintain the Service</li>
                                <li>Process your transactions and manage your subscription</li>
                                <li>Send you technical notices, updates, and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Provide AI-powered insights and analytics (Pro users)</li>
                                <li>Monitor and analyze usage trends to improve the Service</li>
                                <li>Detect, prevent, and address technical issues and security threats</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Data Storage and Security</h2>
                        <div className="space-y-4 text-slate-700 dark:text-slate-300">
                            <p>We implement industry-standard security measures to protect your personal information:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Encryption of data in transit using SSL/TLS</li>
                                <li>Encrypted storage of sensitive information</li>
                                <li>Regular security audits and updates</li>
                                <li>Secure authentication mechanisms</li>
                                <li>Limited employee access to personal data</li>
                            </ul>
                            <p className="mt-4">
                                Your data is stored on secure servers hosted by reputable cloud service providers. We retain your data for as long as your account is active or as needed to provide you services.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Information Sharing and Disclosure</h2>
                        <div className="space-y-4 text-slate-700 dark:text-slate-300">
                            <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., payment processing via Stripe, email delivery)</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Your Data Rights</h2>
                        <div className="space-y-4 text-slate-700 dark:text-slate-300">
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                                <li><strong>Data Portability:</strong> Receive your data in a structured, commonly used format</li>
                                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                                <li><strong>Account Closure:</strong> Delete your account at any time from settings</li>
                            </ul>
                            <p className="mt-4">
                                To exercise these rights, please contact us at{' '}
                                <a href="mailto:privacy@hikariapp.com" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                                    privacy@hikariapp.com
                                </a>
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Cookies and Tracking</h2>
                        <div className="space-y-4 text-slate-700 dark:text-slate-300">
                            <p>We use cookies and similar tracking technologies to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Maintain your session and keep you logged in</li>
                                <li>Remember your preferences and settings</li>
                                <li>Analyze how you use the Service</li>
                                <li>Improve user experience</li>
                            </ul>
                            <p className="mt-4">
                                You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of the Service.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Children's Privacy</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            The Service is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. International Data Transfers</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            Your information may be transferred to and maintained on servers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using the Service, you consent to such transfers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">10. Third-Party Services</h2>
                        <div className="space-y-4 text-slate-700 dark:text-slate-300">
                            <p>Our Service uses third-party services that may collect information:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Stripe:</strong> Payment processing (view their privacy policy at stripe.com/privacy)</li>
                                <li><strong>Email Service Providers:</strong> For transactional emails</li>
                            </ul>
                            <p className="mt-4">
                                We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">11. Changes to This Privacy Policy</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">12. Contact Us</h2>
                        <div className="text-slate-700 dark:text-slate-300">
                            <p>If you have any questions about this Privacy Policy, please contact us:</p>
                            <ul className="list-none space-y-2 mt-4">
                                <li>
                                    <strong>Email:</strong>{' '}
                                    <a href="mailto:privacy@hikariapp.com" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                                        privacy@hikariapp.com
                                    </a>
                                </li>
                                <li>
                                    <strong>Support:</strong>{' '}
                                    <a href="mailto:support@hikariapp.com" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                                        support@hikariapp.com
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
