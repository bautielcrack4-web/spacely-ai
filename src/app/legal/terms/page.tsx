import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-gray-600 mb-8">Last updated: January 24, 2026</p>

                    <div className="prose prose-gray max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                By accessing and using RoomCraft App ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Subscription Services</h2>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Plans and Pricing</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                RoomCraft App offers the following subscription plans:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                                <li><strong>Weekly Unlimited</strong>: $5.99/week - Unlimited designs, all features</li>
                                <li><strong>Monthly Unlimited</strong>: $14.99/month - Unlimited designs, all features, priority support</li>
                                <li><strong>Yearly Unlimited</strong>: $119.99/year - Best value, unlimited designs, all features</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Auto-Renewal</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>IMPORTANT:</strong> Your subscription will automatically renew at the end of each billing period unless you cancel before the renewal date. You will be charged the then-current subscription fee for your plan.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Cancellation</h3>
                            <p className="text-gray-700 leading-relaxed">
                                You may cancel your subscription at any time through your account dashboard. Cancellations take effect at the end of the current billing period. You will retain access to premium features until the end of your paid period.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Refund Policy</h2>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 7-Day Money-Back Guarantee</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We offer a <strong>7-day money-back guarantee</strong> for first-time subscribers. If you're not satisfied with RoomCraft App within 7 days of your initial purchase, contact us at <a href="mailto:bagasystudio@gmail.com" className="text-purple-600 hover:underline">bagasystudio@gmail.com</a> for a full refund.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Refund Exclusions</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Refunds are not available for:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Renewal payments (only initial purchases)</li>
                                <li>Partial billing periods</li>
                                <li>Accounts terminated for Terms of Service violations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                You agree to use RoomCraft App only for lawful purposes. You may not:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Use the Service to generate inappropriate or illegal content</li>
                                <li>Attempt to reverse engineer or exploit the Service</li>
                                <li>Share your account credentials with others</li>
                                <li>Use automated tools to abuse the Service</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>Your Content:</strong> You retain all rights to images you upload. By using our Service, you grant us a license to process your images to provide the Service.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                <strong>Generated Content:</strong> You own the AI-generated designs created through our Service and may use them for personal or commercial purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
                            <p className="text-gray-700 leading-relaxed">
                                RoomCraft App is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Service, including but not limited to lost profits, data loss, or service interruptions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Changes to Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email. Continued use of the Service after changes constitutes acceptance of the new Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
                            <p className="text-gray-700 leading-relaxed">
                                For questions about these Terms, please contact us at:
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
