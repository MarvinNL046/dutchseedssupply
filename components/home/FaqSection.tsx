'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Define FAQ items
const faqItems = [
  {
    question: "How do I choose the right cannabis seeds for my needs?",
    answer: "Consider your growing environment (indoor/outdoor), experience level, desired effects, and local climate. Beginners might prefer autoflowering or feminized seeds, while experienced growers might enjoy the challenge of regular seeds. Our category filters can help you narrow down options based on your specific requirements."
  },
  {
    question: "What's the difference between regular, feminized, and autoflowering seeds?",
    answer: "Regular seeds produce both male and female plants (roughly 50/50 ratio). Feminized seeds are genetically modified to produce only female plants (which produce buds). Autoflowering seeds automatically transition to flowering stage based on age rather than light cycle changes, making them easier to grow but typically with smaller yields."
  },
  {
    question: "How many seeds should I plant to ensure a successful harvest?",
    answer: "We recommend germinating at least 2-3 seeds per desired mature plant, especially for beginners. This accounts for potential germination failures or male plants (with regular seeds). Our seeds have a high germination rate, but having extras provides insurance against unexpected issues."
  },
  {
    question: "Is it legal to buy cannabis seeds in my country?",
    answer: "Cannabis seed legality varies by country and region. In many places, seeds are legal as collector's items or for hemp cultivation, but growing them into plants may be restricted. It's your responsibility to understand local laws before ordering. We ship discreetly worldwide but cannot guarantee delivery in countries with strict customs."
  },
  {
    question: "How do you ship the seeds and is it discreet?",
    answer: "We ship all seeds in crush-proof containers inside plain, unmarked packaging with no reference to cannabis or our company name. For international orders, we use stealth shipping methods and declare packages as common household items. Tracking is available for most shipping options."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit cards, bank transfers, and various cryptocurrencies including Bitcoin, Ethereum, and Litecoin. For customers concerned about privacy, cryptocurrency payments offer the highest level of anonymity and often come with a small discount."
  },
  {
    question: "Do you offer any guarantees on germination?",
    answer: "Yes, we offer a germination guarantee on all our seeds. If less than 80% of your seeds germinate when following our recommended germination method, we'll replace them free of charge. Simply contact our customer service with your order number and photos of the unsuccessful seeds."
  },
  {
    question: "How should I store unused cannabis seeds?",
    answer: "Store unused seeds in a cool, dark, and dry place. Ideally, keep them in an airtight container in the refrigerator (not freezer) at around 6-8°C (42-46°F) with relative humidity below 5%. Properly stored, cannabis seeds can remain viable for 3-5 years or even longer."
  }
];

export default function FaqSection() {
  return (
    <div className="py-16 bg-[#f9f9f7] dark:bg-gray-950 rounded-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          Find answers to common questions about our cannabis seeds and services.
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Still have questions? Contact our support team at{' '}
            <a href="mailto:support@dutchseedsupply.com" className="text-green-600 hover:underline">
              support@dutchseedsupply.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
