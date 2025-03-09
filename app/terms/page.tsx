import React from 'react';
import InfoPageLayout from '@/components/layouts/InfoPageLayout';

export const metadata = {
  title: 'Terms of Service | Dutch Seed Supply',
  description: 'Read our terms of service and conditions for using our website and purchasing our products.',
};

export default function TermsOfServicePage() {
  return (
    <InfoPageLayout title="Terms of Service">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
          <p>
            These terms and conditions govern your use of the Dutch Seed Supply website and the purchase of products from our online store. By accessing our website and placing an order, you agree to be bound by these terms and conditions.
          </p>
          <p className="mt-2">
            Please read these terms carefully before using our website or placing an order. If you do not agree to these terms, you must not use our website or place orders with us.
          </p>
          <p className="mt-2">
            These terms were last updated on March 1, 2025.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Definitions</h2>
          <p>In these terms and conditions, the following definitions apply:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>"We", "us", "our"</strong> refers to Dutch Seed Supply B.V., a company registered in the Netherlands.</li>
            <li><strong>"Website"</strong> refers to the website located at www.dutchseedsupply.com and all associated subdomains.</li>
            <li><strong>"You", "your"</strong> refers to the user or viewer of our website, or the customer placing an order.</li>
            <li><strong>"Products"</strong> refers to the items offered for sale on our website.</li>
            <li><strong>"Order"</strong> refers to your request to purchase products from us.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Use of Our Website</h2>
          <p>
            You may use our website for lawful purposes only. You must not use our website:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>In any way that breaches any applicable local, national or international law or regulation.</li>
            <li>In any way that is unlawful or fraudulent, or has any unlawful or fraudulent purpose or effect.</li>
            <li>To transmit, or procure the sending of, any unsolicited or unauthorized advertising or promotional material.</li>
            <li>To knowingly transmit any data, send or upload any material that contains viruses, Trojan horses, worms, time-bombs, keystroke loggers, spyware, adware or any other harmful programs or similar computer code designed to adversely affect the operation of any computer software or hardware.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Products and Pricing</h2>
          <p>
            All products displayed on our website are subject to availability. We reserve the right to discontinue or modify products without prior notice.
          </p>
          <p className="mt-2">
            Prices for our products are quoted in Euros (€) and include VAT at the current rate unless otherwise stated. Prices are subject to change without notice.
          </p>
          <p className="mt-2">
            We take reasonable care to ensure that the prices of products are correct at the time of publishing. However, if we discover an error in the price of the products you have ordered, we will inform you and give you the option of continuing with your order at the correct price or canceling your order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Ordering and Payment</h2>
          <p>
            By placing an order, you are making an offer to purchase products. All orders are subject to acceptance by us, and we will confirm such acceptance by sending you an order confirmation email.
          </p>
          <p className="mt-2">
            We accept payment by credit/debit card, PayPal, bank transfer, and other methods as indicated on our website. All card payments are subject to authorization by your card issuer.
          </p>
          <p className="mt-2">
            You must be at least 18 years old to place an order on our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Delivery</h2>
          <p>
            We will deliver the products to the address you provide when placing your order. Delivery times are estimates only and cannot be guaranteed.
          </p>
          <p className="mt-2">
            Risk of loss or damage to the products passes to you at the time of delivery or when the products are placed with a carrier for delivery.
          </p>
          <p className="mt-2">
            For more information about our delivery methods and charges, please see our <a href="/shipping" className="text-primary hover:underline">Shipping Information</a> page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Returns and Refunds</h2>
          <p>
            You have the right to cancel your order within 14 days of receiving the products, without giving a reason. To exercise this right, you must inform us of your decision to cancel by a clear statement.
          </p>
          <p className="mt-2">
            You must return the products to us without undue delay and in any event not later than 14 days from the day on which you communicate your cancellation. You will be responsible for the cost of returning the products.
          </p>
          <p className="mt-2">
            For more information about our returns policy, please see our <a href="/returns" className="text-primary hover:underline">Returns Policy</a> page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Intellectual Property</h2>
          <p>
            All content on our website, including text, graphics, logos, images, and software, is the property of Dutch Seed Supply or our content suppliers and is protected by international copyright laws.
          </p>
          <p className="mt-2">
            You may not reproduce, distribute, modify, or create derivative works from any content on our website without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
          <p>
            Nothing in these terms and conditions excludes or limits our liability for death or personal injury arising from our negligence, or our fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited by Dutch law.
          </p>
          <p className="mt-2">
            To the extent permitted by law, we exclude all conditions, warranties, representations or other terms which may apply to our website or any content on it, whether express or implied.
          </p>
          <p className="mt-2">
            We will not be liable to you for any loss or damage, whether in contract, tort (including negligence), breach of statutory duty, or otherwise, even if foreseeable, arising under or in connection with use of, or inability to use, our website or use of or reliance on any content displayed on our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Governing Law and Jurisdiction</h2>
          <p>
            These terms and conditions are governed by Dutch law. You and we both agree to submit to the non-exclusive jurisdiction of the Dutch courts.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>
            If you have any questions about these terms and conditions, please contact us at:
          </p>
          <div className="mt-2">
            <p>Email: legal@dutchseedsupply.com</p>
            <p>Postal address: Dutch Seed Supply B.V., Keizersgracht 123, 1015 CJ Amsterdam, The Netherlands</p>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
}
