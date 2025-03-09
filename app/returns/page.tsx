import React from 'react';
import InfoPageLayout from '@/components/layouts/InfoPageLayout';

export const metadata = {
  title: 'Returns Policy | Dutch Seed Supply',
  description: 'Learn about our returns and refunds policy for products purchased from Dutch Seed Supply.',
};

export default function ReturnsPage() {
  return (
    <InfoPageLayout title="Returns Policy">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Returns Policy</h2>
          <p>
            At Dutch Seed Supply, we want you to be completely satisfied with your purchase. If for any reason you are not satisfied, we offer a straightforward returns policy to ensure your shopping experience is as pleasant as possible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Return Eligibility</h2>
          <p>
            You may return most new, unopened items within 14 days of delivery for a full refund. We also accept returns of opened items within 14 days if the item is defective or damaged upon receipt.
          </p>
          <p className="mt-2">
            To be eligible for a return, your item must be:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>In the same condition that you received it</li>
            <li>In the original packaging</li>
            <li>Accompanied by the receipt or proof of purchase</li>
          </ul>
          <p className="mt-2">
            Please note that certain items are non-returnable due to health and safety reasons, including:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Seeds that have been opened</li>
            <li>Growing media that has been opened or used</li>
            <li>Personalized or custom-made products</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Return Process</h2>
          <p>
            To start the return process, please follow these steps:
          </p>
          <ol className="list-decimal pl-6 mt-2 space-y-2">
            <li>
              <strong>Contact us:</strong> Email our customer service team at returns@dutchseedsupply.com or call us at +31 (0) 20 123 4567 to request a return. Please include your order number and the reason for your return.
            </li>
            <li>
              <strong>Receive return authorization:</strong> We will provide you with a return authorization number and return instructions.
            </li>
            <li>
              <strong>Package your return:</strong> Securely pack the items in their original packaging, including all accessories and documentation.
            </li>
            <li>
              <strong>Ship your return:</strong> Send your package to the address provided in the return instructions. We recommend using a trackable shipping service.
            </li>
          </ol>
          <p className="mt-2">
            Please note that you are responsible for the cost of returning the item unless the item is defective or damaged upon receipt.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Refunds</h2>
          <p>
            Once we receive and inspect your return, we will notify you of the approval or rejection of your refund.
          </p>
          <p className="mt-2">
            If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days. Please note that depending on your credit card company, it may take an additional 2-10 business days for the refund to appear on your statement.
          </p>
          <p className="mt-2">
            If your return is rejected, we will provide you with the reason and information on how to ship the item back to you if desired.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Late or Missing Refunds</h2>
          <p>
            If you have not received your refund within the timeframe mentioned above, please check your bank account again. Then contact your credit card company, as it may take some time before your refund is officially posted. Next, contact your bank, as there is often some processing time before a refund is posted.
          </p>
          <p className="mt-2">
            If you have done all of this and you still have not received your refund, please contact our customer service team at returns@dutchseedsupply.com.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Exchanges</h2>
          <p>
            We only replace items if they are defective or damaged. If you need to exchange an item for the same item, send us an email at returns@dutchseedsupply.com and follow the return process outlined above.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective item, please contact us immediately at returns@dutchseedsupply.com with details of the damage or defect. Please include photos of the damaged item and packaging if possible.
          </p>
          <p className="mt-2">
            We will provide you with a prepaid shipping label for the return and send you a replacement as soon as possible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Cancellations</h2>
          <p>
            If you need to cancel an order, please contact us as soon as possible at orders@dutchseedsupply.com. If your order has not been shipped yet, we will process your cancellation and issue a full refund. If your order has already been shipped, you will need to follow our return process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>
            If you have any questions about our returns policy, please contact us:
          </p>
          <div className="mt-2">
            <p>Email: returns@dutchseedsupply.com</p>
            <p>Phone: +31 (0) 20 123 4567</p>
            <p>Postal address: Dutch Seed Supply B.V., Keizersgracht 123, 1015 CJ Amsterdam, The Netherlands</p>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
}
