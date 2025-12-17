import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - All About Table Tennis',
  description: 'Privacy Policy for All About Table Tennis. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="font-display font-bold text-4xl lg:text-5xl text-black mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-8">
          <strong>Effective Date:</strong> December 17, 2025
        </p>

        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg space-y-8">
          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us when you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Create an account or place an order</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us for customer support</li>
              <li>Submit a racket for evaluation (Sell Your Racket)</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>Personal Information:</strong> Name, email address, phone number, shipping address, billing address, and payment information.
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Technical Information:</strong> IP address, browser type, device information, and cookies.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about orders, shipping, and customer service</li>
              <li>Send promotional emails and offers (with your consent)</li>
              <li>Improve our website and customer experience</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              3. Information Sharing
            </h2>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Service Providers:</strong> Payment processors (Razorpay), shipping companies, and email service providers</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In the event of a merger or acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              4. Payment Information
            </h2>
            <p className="text-gray-700">
              All payment transactions are processed securely through Razorpay. We do not store your complete credit/debit card information on our servers. Payment information is encrypted and handled according to PCI DSS standards.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              5. Cookies and Tracking
            </h2>
            <p className="text-gray-700">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              6. Data Security
            </h2>
            <p className="text-gray-700">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              7. Your Rights
            </h2>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-gray-700">
              Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              9. Changes to This Policy
            </h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the effective date.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 space-y-2 text-gray-700">
              <p><strong>All About Table Tennis</strong></p>
              <p>Email: <a href="mailto:contact@allabouttabletennis.in" className="text-primary hover:underline">contact@allabouttabletennis.in</a></p>
              <p>Phone: <a href="tel:+919325173787" className="text-primary hover:underline">+91 93251 73787</a></p>
              <p>Website: <a href="https://allabouttabletennis.in" className="text-primary hover:underline">allabouttabletennis.in</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
