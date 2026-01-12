import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions - All About Table Tennis',
  description: 'Terms and Conditions for using All About Table Tennis website and services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="font-display font-bold text-4xl lg:text-5xl text-black mb-6">
          Terms and Conditions
        </h1>
        <p className="text-gray-600 mb-8">
          <strong>Effective Date:</strong> December 17, 2025
        </p>

        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg space-y-8">
          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700">
              By accessing and using the All About Table Tennis website (allabouttabletennis.in), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              2. Use of Website
            </h2>
            <p className="text-gray-700 mb-4">
              You agree to use our website only for lawful purposes and in a manner that does not infringe the rights of others. You must not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Transmit any harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated systems to access the website</li>
              <li>Reproduce, duplicate, or copy any part of our website without permission</li>
              <li>Engage in fraudulent activities</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              3. Product Information and Pricing
            </h2>
            <p className="text-gray-700">
              We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions, images, or other content is accurate, complete, or error-free. We reserve the right to correct any errors and to change or update information at any time without prior notice.
            </p>
            <p className="text-gray-700 mt-4">
              All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              4. Orders and Payment
            </h2>
            <p className="text-gray-700 mb-4">
              <strong>Order Acceptance:</strong> We reserve the right to refuse or cancel any order for any reason, including product availability, errors in pricing, or suspected fraudulent activity.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Payment:</strong> All payments are processed securely through Razorpay. By placing an order, you authorize us to charge the payment method provided for the total amount of your purchase.
            </p>
            <p className="text-gray-700">
              <strong>Order Confirmation:</strong> You will receive an order confirmation email once your order is successfully placed.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              5. Customized Rackets
            </h2>
            <p className="text-gray-700">
              When you customize a racket using our "Customize Your Racket" tool, the blade and rubbers will be professionally assembled and pasted together before shipment. Customized rackets are subject to our standard return and refund policy, except in cases where the assembly is defective.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              6. Pre-Owned Equipment
            </h2>
            <p className="text-gray-700 mb-4">
              <strong>Final Sale:</strong> All pre-owned rackets are sold as-is and are final sale. No returns or exchanges are accepted for pre-owned items.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Inspection:</strong> All pre-owned equipment has been professionally inspected and verified for structural integrity. Condition reports are provided for transparency.
            </p>
            <p className="text-gray-700">
              <strong>Limited Quantity:</strong> Pre-owned items are available in limited quantities and are sold on a first-come, first-served basis.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-700">
              All content on this website, including text, graphics, logos, images, and software, is the property of All About Table Tennis or its licensors and is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              8. Product Authenticity
            </h2>
            <p className="text-gray-700">
              We guarantee that all new products sold on our website are 100% authentic and sourced directly from authorized distributors or manufacturers. All products come with manufacturer warranties where applicable.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-gray-700">
              To the maximum extent permitted by law, All About Table Tennis shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our website or products, including but not limited to loss of profits, data, or goodwill.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              10. Indemnification
            </h2>
            <p className="text-gray-700">
              You agree to indemnify and hold harmless All About Table Tennis and its employees from any claims, damages, or expenses arising from your use of our website or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              11. Governing Law
            </h2>
            <p className="text-gray-700">
              These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Maharashtra, India.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              12. Changes to Terms
            </h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              13. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms and Conditions, please contact us:
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
