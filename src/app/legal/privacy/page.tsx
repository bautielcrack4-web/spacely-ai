import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-gray-600 mb-8">Last updated: January 24, 2026</p>

                    <div className="prose prose-gray max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 Account Information</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                When you create an account, we collect:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Email address</li>
                                <li>Password (encrypted)</li>
                                <li>Account preferences</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">1.2 Payment Information</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Payment processing is handled by <strong>Lemon Squeezy</strong>, our trusted payment processor. We do not store your credit card information on our servers. Lemon Squeezy collects:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Billing name and address</li>
                                <li>Payment method details</li>
                                <li>Transaction history</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">1.3 Usage Data</h3>
                            <p className="text-gray-700 leading-relaxed">
                                We collect information about how you use RoomCraft App, including:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Images you upload (temporarily processed, not permanently stored)</li>
                                <li>Generated designs (stored in your account)</li>
                                <li>Feature usage statistics</li>
                                <li>Device and browser information</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We use collected information to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li><strong>Provide the Service:</strong> Process images, generate designs, manage your account</li>
                                <li><strong>Process Payments:</strong> Handle subscriptions and billing</li>
                                <li><strong>Improve the Service:</strong> Analyze usage patterns, fix bugs, develop new features</li>
                                <li><strong>Communicate:</strong> Send account notifications, billing updates, and service announcements</li>
                                <li><strong>Prevent Abuse:</strong> Detect and prevent fraudulent activity</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Storage and Security</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>Storage:</strong> Your data is stored securely using Supabase (PostgreSQL database) with industry-standard encryption.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>Image Processing:</strong> Uploaded images are processed temporarily and are not permanently stored on our servers. Generated designs are saved to your account.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                <strong>Security Measures:</strong> We implement SSL/TLS encryption, secure authentication, and regular security audits to protect your data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We do not sell your personal information. We share data only with:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li><strong>Lemon Squeezy:</strong> Payment processing</li>
                                <li><strong>Supabase:</strong> Database hosting</li>
                                <li><strong>Replicate:</strong> AI image processing</li>
                                <li><strong>Vercel:</strong> Application hosting</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                All third-party services are GDPR and CCPA compliant.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li><strong>Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Rectification:</strong> Correct inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                                <li><strong>Data Portability:</strong> Export your generated designs</li>
                                <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                To exercise these rights, contact us at <a href="mailto:bagasystudio@gmail.com" className="text-purple-600 hover:underline">bagasystudio@gmail.com</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We use essential cookies to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Maintain your login session</li>
                                <li>Remember your preferences</li>
                                <li>Analyze site performance</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                You can disable cookies in your browser settings, but this may affect functionality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                RoomCraft App is not intended for users under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Users</h2>
                            <p className="text-gray-700 leading-relaxed">
                                RoomCraft App is operated from the United States. If you are accessing the Service from outside the US, your information may be transferred to and processed in the US. By using the Service, you consent to this transfer.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Privacy Policy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of significant changes via email. Your continued use of the Service after changes constitutes acceptance of the updated policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed">
                                For privacy-related questions or to exercise your rights, contact us at:
                            </p>
                            <p className="text-gray-700 mt-2">
                                <strong>Email:</strong> <a href="mailto:bagasystudio@gmail.com" className="text-purple-600 hover:underline">bagasystudio@gmail.com</a><br />
                                <strong>Company:</strong> Bagasy Studio
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
