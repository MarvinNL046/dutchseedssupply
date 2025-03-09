import React from 'react';
import InfoPageLayout from '@/components/layouts/InfoPageLayout';

export const metadata = {
  title: 'Shipping Information | Dutch Seed Supply',
  description: 'Learn about our shipping methods, delivery times, and costs for domestic and international orders.',
};

export default function ShippingPage() {
  return (
    <InfoPageLayout title="Shipping Information">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Shipping Policy</h2>
          <p>
            At Dutch Seed Supply, we strive to deliver your orders promptly and securely. We ship to most countries worldwide, with a few exceptions due to local regulations regarding seed imports.
          </p>
          <p className="mt-2">
            Please note that it is the customer&apos;s responsibility to check local regulations regarding the import of seeds before placing an order. Dutch Seed Supply cannot be held responsible for any customs issues, confiscations, or legal problems that may arise from importing seeds into your country.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Processing Time</h2>
          <p>
            All orders are processed within 1-2 business days (Monday-Friday, excluding holidays) after receiving your order confirmation email. Orders placed after 2:00 PM CET will be processed the next business day.
          </p>
          <p className="mt-2">
            During peak seasons or promotional periods, processing times may be slightly longer. If there is a significant delay, we will contact you via email.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Shipping Methods and Delivery Times</h2>
          <h3 className="text-xl font-medium mt-4 mb-2">Netherlands</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Shipping Method</th>
                  <th className="border px-4 py-2 text-left">Delivery Time</th>
                  <th className="border px-4 py-2 text-left">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Standard Shipping</td>
                  <td className="border px-4 py-2">1-2 business days</td>
                  <td className="border px-4 py-2">€4.95</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Express Shipping</td>
                  <td className="border px-4 py-2">Next business day</td>
                  <td className="border px-4 py-2">€7.95</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Free Shipping</td>
                  <td className="border px-4 py-2">1-2 business days</td>
                  <td className="border px-4 py-2">Free for orders over €50</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-medium mt-4 mb-2">European Union</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Shipping Method</th>
                  <th className="border px-4 py-2 text-left">Delivery Time</th>
                  <th className="border px-4 py-2 text-left">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Standard Shipping</td>
                  <td className="border px-4 py-2">3-5 business days</td>
                  <td className="border px-4 py-2">€9.95</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Express Shipping</td>
                  <td className="border px-4 py-2">2-3 business days</td>
                  <td className="border px-4 py-2">€14.95</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Free Shipping</td>
                  <td className="border px-4 py-2">3-5 business days</td>
                  <td className="border px-4 py-2">Free for orders over €75</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-medium mt-4 mb-2">International (Non-EU)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Shipping Method</th>
                  <th className="border px-4 py-2 text-left">Delivery Time</th>
                  <th className="border px-4 py-2 text-left">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Standard Shipping</td>
                  <td className="border px-4 py-2">7-14 business days</td>
                  <td className="border px-4 py-2">€14.95</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Express Shipping</td>
                  <td className="border px-4 py-2">3-7 business days</td>
                  <td className="border px-4 py-2">€24.95</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Free Shipping</td>
                  <td className="border px-4 py-2">7-14 business days</td>
                  <td className="border px-4 py-2">Free for orders over €100</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4">
            Please note that delivery times are estimates and not guarantees. Actual delivery times may vary depending on factors such as customs processing, local postal services, and unforeseen circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Tracking Your Order</h2>
          <p>
            Once your order is shipped, you will receive a shipping confirmation email with a tracking number. You can use this tracking number to monitor the status of your delivery on our website or directly on the carrier&apos;s website.
          </p>
          <p className="mt-2">
            If you have not received a tracking number within 3 business days after receiving your order confirmation, please contact our customer service team at orders@dutchseedsupply.com.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Customs, Duties, and Taxes</h2>
          <p>
            For international orders (outside the EU), you may be subject to import duties, taxes, and customs clearance fees imposed by your country. These charges are the responsibility of the recipient and are not included in our shipping fees.
          </p>
          <p className="mt-2">
            We cannot predict what these charges might be, as customs policies vary widely from country to country. For more information, please contact your local customs office before placing your order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Shipping Restrictions</h2>
          <p>
            Due to legal restrictions, we cannot ship to certain countries. If you are unsure whether we can ship to your country, please contact our customer service team before placing an order.
          </p>
          <p className="mt-2">
            Additionally, some products may have specific shipping restrictions. These restrictions will be noted on the product page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Shipping Address</h2>
          <p>
            It is the customer&apos;s responsibility to provide a correct and complete shipping address. Dutch Seed Supply is not responsible for packages that are lost or delayed due to incorrect address information.
          </p>
          <p className="mt-2">
            If you need to change your shipping address after placing an order, please contact us as soon as possible at orders@dutchseedsupply.com. We will do our best to accommodate your request, but we cannot guarantee that we can change the address once the order has been processed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Lost or Damaged Packages</h2>
          <p>
            If your package is lost or damaged during transit, please contact our customer service team at orders@dutchseedsupply.com within 7 days of the expected delivery date. We will work with the shipping carrier to locate your package or process a replacement or refund.
          </p>
          <p className="mt-2">
            For damaged packages, please take photos of the damaged packaging and contents before contacting us. This will help us process your claim more efficiently.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>
            If you have any questions about our shipping policy, please contact us:
          </p>
          <div className="mt-2">
            <p>Email: orders@dutchseedsupply.com</p>
            <p>Phone: +31 (0) 20 123 4567</p>
            <p>Postal address: Dutch Seed Supply B.V., Keizersgracht 123, 1015 CJ Amsterdam, The Netherlands</p>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
}
