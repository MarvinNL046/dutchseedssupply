import React from 'react';
import InfoPageLayout from '@/components/layouts/InfoPageLayout';

export const metadata = {
  title: 'Cookie Policy | Dutch Seed Supply',
  description: 'Learn about how we use cookies and similar technologies on our website.',
};

export default function CookiePolicyPage() {
  return (
    <InfoPageLayout title="Cookie Policy">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
          <p>
            This Cookie Policy explains how Dutch Seed Supply B.V. (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies and similar technologies on our website www.dutchseedsupply.com. This policy should be read alongside our Privacy Policy, which explains how we use your personal information.
          </p>
          <p className="mt-2">
            By continuing to browse or use our website, you agree to our use of cookies as described in this policy.
          </p>
          <p className="mt-2">
            This Cookie Policy was last updated on March 1, 2025.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the website owners.
          </p>
          <p className="mt-2">
            Cookies allow a website to recognize your device and remember if you have visited the site before. They can be temporary (session cookies) which are deleted when you close your browser, or persistent (permanent cookies) which remain on your device for a longer period.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">How We Use Cookies</h2>
          <p>
            We use cookies for various purposes, including:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Essential cookies:</strong> These are necessary for the website to function properly. They enable basic functions like page navigation, secure areas, and shopping cart functionality. The website cannot function properly without these cookies.</li>
            <li><strong>Preference cookies:</strong> These cookies remember your preferences and settings to enhance your experience on our website.</li>
            <li><strong>Analytics cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website.</li>
            <li><strong>Marketing cookies:</strong> These are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Types of Cookies We Use</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Category</th>
                  <th className="border px-4 py-2 text-left">Purpose</th>
                  <th className="border px-4 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Session</td>
                  <td className="border px-4 py-2">To keep track of your shopping cart and order process</td>
                  <td className="border px-4 py-2">Session (deleted when browser is closed)</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Authentication</td>
                  <td className="border px-4 py-2">To identify you when you log in to our website</td>
                  <td className="border px-4 py-2">30 days</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Preferences</td>
                  <td className="border px-4 py-2">To remember your settings and preferences</td>
                  <td className="border px-4 py-2">1 year</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Analytics</td>
                  <td className="border px-4 py-2">To help us understand how visitors use our website</td>
                  <td className="border px-4 py-2">2 years</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Marketing</td>
                  <td className="border px-4 py-2">To provide you with relevant advertisements</td>
                  <td className="border px-4 py-2">90 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third parties on our website. These third parties may include:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Google Analytics:</strong> We use Google Analytics to understand how visitors interact with our website. Google Analytics collects information about your use of our website, including your IP address. You can learn more about Google Analytics cookies <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">here</a>.</li>
            <li><strong>Payment processors:</strong> When you make a purchase, our payment processors may use cookies to process your payment securely.</li>
            <li><strong>Social media:</strong> If you use social media sharing buttons on our website, these companies may place cookies on your device.</li>
          </ul>
          <p className="mt-2">
            We do not control these third-party cookies. You can check the third party&apos;s website for more information about these cookies and how to manage them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Managing Cookies</h2>
          <p>
            Most web browsers allow you to manage your cookie preferences. You can:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Delete cookies from your device</li>
            <li>Block cookies by activating the setting on your browser that allows you to refuse all or some cookies</li>
            <li>Set your browser to notify you when you receive a cookie</li>
          </ul>
          <p className="mt-2">
            Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our website, and some services may not function properly.
          </p>
          <p className="mt-2">
            To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">How to Control Cookies in Your Browser</h2>
          <p>
            Here are links to instructions on how to manage cookies in some common browsers:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><a href="https://support.google.com/chrome/answer/95647" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will be posted on this page, and if the changes are significant, we will provide a more prominent notice.
          </p>
          <p className="mt-2">
            We encourage you to check this page periodically to stay informed about our use of cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us:
          </p>
          <div className="mt-2">
            <p>Email: privacy@dutchseedsupply.com</p>
            <p>Phone: +31 (0) 20 123 4567</p>
            <p>Postal address: Dutch Seed Supply B.V., Keizersgracht 123, 1015 CJ Amsterdam, The Netherlands</p>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
}
