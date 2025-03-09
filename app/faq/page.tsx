import React from 'react';
import InfoPageLayout from '@/components/layouts/InfoPageLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata = {
  title: 'Frequently Asked Questions | Dutch Seed Supply',
  description: 'Find answers to common questions about our products, shipping, and more.',
};

export default function FAQPage() {
  const faqItems = [
    {
      question: 'How long does shipping take?',
      answer: 'Shipping times vary depending on your location. Typically, orders within the Netherlands are delivered within 1-3 business days. International orders may take 5-14 business days depending on the destination country and customs processing.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. However, please note that some countries have restrictions on importing seeds. It is the customer&apos;s responsibility to check local regulations before placing an order.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including credit/debit cards, PayPal, bank transfers, and cryptocurrency. All payments are processed securely.'
    },
    {
      question: 'Are your seeds organic?',
      answer: 'Many of our seeds are organic and we clearly label them as such in our product descriptions. We work with reputable growers who follow sustainable farming practices.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 14 days of delivery if the products are unopened and in their original packaging. Please visit our Returns page for more detailed information.'
    },
    {
      question: 'How should I store my seeds?',
      answer: 'Seeds should be stored in a cool, dry place away from direct sunlight. Ideally, they should be kept in an airtight container at a consistent temperature between 5-10°C (40-50°F).'
    },
    {
      question: 'Do you offer discounts for bulk orders?',
      answer: 'Yes, we offer discounts for bulk orders. The discount percentage increases with the order quantity. Please contact our customer service for specific pricing on large orders.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you will receive a confirmation email with tracking information. You can also track your order by logging into your account on our website.'
    },
    {
      question: 'What is the germination rate of your seeds?',
      answer: 'Our seeds typically have a germination rate of 85-95%, which is above industry standards. We regularly test our seed batches to ensure high quality.'
    },
    {
      question: 'Do you offer growing advice?',
      answer: 'Yes, we provide basic growing information on each product page. For more detailed guidance, please check our blog or growing guides section on the website.'
    }
  ];

  return (
    <InfoPageLayout title="Frequently Asked Questions">
      <p className="text-lg mb-8">
        Find answers to the most commonly asked questions about Dutch Seed Supply, our products, shipping, and more. If you can&apos;t find the answer you&apos;re looking for, please don&apos;t hesitate to <a href="/contact" className="text-primary hover:underline">contact us</a>.
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <p>{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </InfoPageLayout>
  );
}
