import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy - All About Table Tennis',
  description: 'Shipping information and timelines for All About Table Tennis orders.',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="font-display font-bold text-4xl lg:text-5xl text-black mb-6">
          Shipping Policy
        </h1>
        <p className="text-gray-600 mb-8">
          <strong>Last Updated:</strong> December 17, 2025
        </p>

        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg space-y-8">
          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              1. Shipping Areas
            </h2>
            <p className="text-gray-700 mb-4">
              We currently ship to the following locations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Service Area:</strong> Pan India (All states and territories)</li>
              <li><strong>Pan-India Delivery:</strong> All major cities and towns across India</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              2. Shipping Options
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-xl text-blue-900 mb-3">🚚 Pune Shipping</h3>
                <ul className="space-y-2 text-blue-800">
                  <li><strong>Standard Shipping:</strong> 24 hours - FREE</li>
                  <li><strong>Express Shipping:</strong> 3-4 hours - ₹100 extra</li>
                  <li><strong>Same Day Shipping:</strong> Order before 2 PM for arrival by 8 PM</li>
                </ul>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-xl text-green-900 mb-3">📦 Pan-India Shipping</h3>
                <ul className="space-y-2 text-green-800">
                  <li><strong>Standard Shipping:</strong> 4-5 business days - ₹100 (Free above ₹10,000)</li>
                  <li><strong>Express Shipping:</strong> 1-2 business days - ₹250</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              3. Order Processing Time
            </h2>
            <p className="text-gray-700 mb-4">
              <strong>In-Stock Items:</strong> Orders are processed within 1-2 business days of payment confirmation (Monday-Saturday, excluding public holidays).
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Customized Rackets:</strong> Require 1-2 additional business days for professional assembly (blade and rubber pasting).
            </p>
            <p className="text-gray-700">
              <strong>Pre-Owned Items:</strong> Shipped within 1-2 business days after final inspection and quality check.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              4. Shipping Charges
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Order Value</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">All India</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Metro Cities</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Rest of India</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Below ₹1000</td>
                    <td className="border border-gray-300 px-4 py-2">FREE</td>
                    <td className="border border-gray-300 px-4 py-2">₹99</td>
                    <td className="border border-gray-300 px-4 py-2">₹149</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">₹1000 - ₹2999</td>
                    <td className="border border-gray-300 px-4 py-2">FREE</td>
                    <td className="border border-gray-300 px-4 py-2">₹99</td>
                    <td className="border border-gray-300 px-4 py-2">₹149</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">₹3000 and above</td>
                    <td className="border border-gray-300 px-4 py-2">FREE</td>
                    <td className="border border-gray-300 px-4 py-2">FREE</td>
                    <td className="border border-gray-300 px-4 py-2">FREE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              5. Order Tracking
            </h2>
            <p className="text-gray-700 mb-4">
              Once your order is shipped, you will receive:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Email confirmation with tracking number</li>
              <li>WhatsApp notification with live tracking link</li>
              <li>SMS updates at key shipping milestones</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can track your order status anytime by contacting us at +91 93251 73787 or via WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              6. Cash on Delivery (COD)
            </h2>
            <p className="text-gray-700 mb-4">
              COD is available for orders:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Across India: All orders accepted</li>
              <li>Metro Cities: Orders up to ₹10,000</li>
              <li>Other locations: Orders up to ₹5,000</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>COD Charges:</strong> ₹50 for orders below ₹2000 | FREE for orders above ₹2000
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              7. Packaging
            </h2>
            <p className="text-gray-700">
              All products are carefully packaged to prevent damage during transit. Blades and rubbers are wrapped with protective materials. Customized rackets are packed in specialized cases to ensure safe shipping.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              8. Shipping Attempts
            </h2>
            <p className="text-gray-700 mb-4">
              Our courier partner will attempt shipping up to 3 times. If shipment cannot be completed:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>We will contact you to reschedule</li>
              <li>Package will be held at the local courier facility for 7 days</li>
              <li>After 7 days, the order will be returned to us</li>
              <li>Return shipping charges may apply for re-shipment</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              9. Damaged or Lost Shipments
            </h2>
            <p className="text-gray-700 mb-4">
              <strong>Damaged Package:</strong> If your package arrives damaged, please refuse the shipment and contact us immediately. Do not accept damaged packages.
            </p>
            <p className="text-gray-700">
              <strong>Lost Package:</strong> If your shipment is lost in transit, we will investigate with the courier and provide a replacement or full refund within 7-10 business days.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              10. International Shipping
            </h2>
            <p className="text-gray-700">
              We currently do not offer international shipping. We only deliver within India. International shipping may be added in the future.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-black mb-4">
              11. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              For shipping inquiries or issues, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 space-y-2 text-gray-700">
              <p><strong>All About Table Tennis</strong></p>
              <p>Email: <a href="mailto:contact@allabouttabletennis.in" className="text-primary hover:underline">contact@allabouttabletennis.in</a></p>
              <p>Phone: <a href="tel:+919325173787" className="text-primary hover:underline">+91 93251 73787</a></p>
              <p>WhatsApp: <a href="https://wa.me/919325173787" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">+91 93251 73787</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
