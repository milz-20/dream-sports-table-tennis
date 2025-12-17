import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy - All About Table Tennis',
  description: 'Cancellation and refund policy for All About Table Tennis orders.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="font-display font-bold text-4xl lg:text-5xl text-black mb-6">
          Cancellation & Refund Policy
        </h1>
        <p className="text-gray-600 mb-8">
          <strong>Last Updated:</strong> December 17, 2025
        </p>

        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg space-y-8">
          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              1. Order Cancellation
            </h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h3 className="font-bold text-lg text-blue-900 mb-2">Before Shipment</h3>
                <p className="text-blue-800">
                  You can cancel your order free of charge if it has not been shipped. Cancellations can be made by contacting us via phone, email, or WhatsApp.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <h3 className="font-bold text-lg text-yellow-900 mb-2">After Shipment</h3>
                <p className="text-yellow-800">
                  Once shipped, orders cannot be cancelled. However, you may refuse delivery or return the product as per our return policy.
                </p>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <h3 className="font-bold text-lg text-amber-900 mb-2">Customized Rackets</h3>
                <p className="text-amber-800">
                  Orders for customized rackets (blade + rubbers assembled) cannot be cancelled once assembly has begun (typically within 4 hours of order).
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              2. Return Policy
            </h2>
            
            <p className="text-gray-700 mb-4">
              We want you to be completely satisfied with your purchase. Returns are accepted under the following conditions:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-black mb-2">✅ Eligible for Return:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Defective or damaged products</li>
                  <li>Wrong product delivered</li>
                  <li>Product not as described</li>
                  <li>Missing items from order</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  <strong>Return Window:</strong> 7 days from delivery date
                </p>
              </div>

              <div>
                <h3 className="font-bold text-lg text-black mb-2">❌ Not Eligible for Return:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Pre-owned equipment (Final Sale - No Returns)</li>
                  <li>Products with broken seals or used items</li>
                  <li>Customized rackets (assembled blade + rubbers) unless defective</li>
                  <li>Change of mind or wrong selection</li>
                  <li>Products damaged due to misuse</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              3. Return Process
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Contact Us</h4>
                  <p className="text-gray-700">
                    Call/WhatsApp us at +91 93251 73787 or email contact@allabouttabletennis.in within 7 days of delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Provide Details</h4>
                  <p className="text-gray-700">
                    Share your order number, reason for return, and photos/videos of the issue (if applicable).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Approval & Pickup</h4>
                  <p className="text-gray-700">
                    Once approved, we'll arrange a free pickup from your address (within Pune) or provide return shipping instructions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Inspection & Refund</h4>
                  <p className="text-gray-700">
                    We'll inspect the returned product and process your refund within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              4. Refund Policy
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-black mb-2">Refund Methods:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>Online Payments:</strong> Refunded to original payment method (UPI, Card, Net Banking) within 5-7 business days</li>
                  <li><strong>Cash on Delivery:</strong> Refunded via bank transfer (NEFT/IMPS) within 7-10 business days</li>
                  <li><strong>Store Credit:</strong> Instant store credit available if preferred (additional 10% bonus)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg text-black mb-2">Refund Timeline:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>UPI/Wallet: 3-5 business days</li>
                  <li>Credit/Debit Card: 5-7 business days</li>
                  <li>Net Banking: 5-7 business days</li>
                  <li>COD Orders: 7-10 business days (bank transfer)</li>
                </ul>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <p className="text-green-800">
                  <strong>Note:</strong> Bank processing times may vary. If you don't receive your refund within the stated period, please contact your bank or reach out to us for assistance.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              5. Exchange Policy
            </h2>
            <p className="text-gray-700 mb-4">
              Exchanges are available for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Wrong product delivered</li>
              <li>Defective products (subject to inspection)</li>
              <li>Size/specification issues (rubbers only)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>Exchange Process:</strong> Follow the same return process. Once we receive the product, we'll ship the replacement within 24-48 hours at no additional cost.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              6. Damaged or Defective Products
            </h2>
            <p className="text-gray-700 mb-4">
              If you receive a damaged or defective product:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Do not accept delivery if package is visibly damaged</li>
              <li>Contact us immediately with photos/videos</li>
              <li>We'll arrange immediate replacement or full refund</li>
              <li>No questions asked for manufacturing defects</li>
            </ul>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mt-4">
              <p className="text-red-800">
                <strong>Important:</strong> Please inspect your order upon delivery. Report any issues within 24 hours for fastest resolution.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              7. Pre-Owned Equipment Policy
            </h2>
            <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-6">
              <h3 className="font-bold text-xl text-amber-900 mb-3">⚠️ Important Notice</h3>
              <p className="text-amber-800 mb-3">
                <strong>All pre-owned equipment is FINAL SALE.</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-amber-800 ml-4">
                <li>No returns or refunds accepted</li>
                <li>No exchanges available</li>
                <li>All items professionally inspected before listing</li>
                <li>Condition reports provided for transparency</li>
                <li>Limited quantity - sold as-is</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              8. Return Shipping Charges
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Reason</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Who Pays</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Defective/Damaged Product</td>
                    <td className="border border-gray-300 px-4 py-2">FREE (We arrange pickup)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Wrong Product Delivered</td>
                    <td className="border border-gray-300 px-4 py-2">FREE (We arrange pickup)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Change of Mind</td>
                    <td className="border border-gray-300 px-4 py-2">Not Accepted</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              9. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              For cancellations, returns, or refund inquiries:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 space-y-2 text-gray-700">
              <p><strong>All About Table Tennis</strong></p>
              <p>Email: <a href="mailto:contact@allabouttabletennis.in" className="text-primary hover:underline">contact@allabouttabletennis.in</a></p>
              <p>Phone: <a href="tel:+919325173787" className="text-primary hover:underline">+91 93251 73787</a></p>
              <p>WhatsApp: <a href="https://wa.me/919325173787" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">+91 93251 73787</a></p>
              <p className="text-sm text-gray-600 mt-2">Support Hours: Monday-Saturday, 10 AM - 7 PM IST</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
