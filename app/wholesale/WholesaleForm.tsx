'use client';

import { useState } from 'react';

type WholesaleFormProps = {
  productName?: string;
  locale?: string;
};

export default function WholesaleForm({
  productName,
  locale = 'nl',
}: WholesaleFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    message: productName ? `I'm interested in wholesale pricing for ${productName} (1000+ seeds).` : '',
    kvkNumber: '', // Chamber of Commerce number (Netherlands)
    vatNumber: '', // VAT number for EU businesses
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // In a real implementation, you would send this data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        country: '',
        message: '',
        kvkNumber: '',
        vatNumber: '',
      });
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get text based on locale
  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      companyName: {
        en: 'Company Name',
        nl: 'Bedrijfsnaam',
        de: 'Firmenname',
        fr: 'Nom de l\'entreprise',
      },
      contactName: {
        en: 'Contact Name',
        nl: 'Contactpersoon',
        de: 'Kontaktperson',
        fr: 'Nom du contact',
      },
      email: {
        en: 'Email Address',
        nl: 'E-mailadres',
        de: 'E-Mail-Adresse',
        fr: 'Adresse e-mail',
      },
      phone: {
        en: 'Phone Number',
        nl: 'Telefoonnummer',
        de: 'Telefonnummer',
        fr: 'Numéro de téléphone',
      },
      country: {
        en: 'Country',
        nl: 'Land',
        de: 'Land',
        fr: 'Pays',
      },
      message: {
        en: 'Message',
        nl: 'Bericht',
        de: 'Nachricht',
        fr: 'Message',
      },
      kvkNumber: {
        en: 'Chamber of Commerce Number',
        nl: 'KVK Nummer',
        de: 'Handelsregisternummer',
        fr: 'Numéro de registre du commerce',
      },
      vatNumber: {
        en: 'VAT Number',
        nl: 'BTW Nummer',
        de: 'Umsatzsteuer-ID',
        fr: 'Numéro de TVA',
      },
      submit: {
        en: 'Submit Inquiry',
        nl: 'Verstuur Aanvraag',
        de: 'Anfrage Senden',
        fr: 'Envoyer la Demande',
      },
      submitting: {
        en: 'Submitting...',
        nl: 'Versturen...',
        de: 'Wird gesendet...',
        fr: 'Envoi en cours...',
      },
      success: {
        en: 'Thank you for your inquiry! We will contact you within 24 hours with wholesale pricing information.',
        nl: 'Bedankt voor je aanvraag! We nemen binnen 24 uur contact met je op met informatie over groothandelsprijzen.',
        de: 'Vielen Dank für Ihre Anfrage! Wir werden Sie innerhalb von 24 Stunden mit Informationen zu Großhandelspreisen kontaktieren.',
        fr: 'Merci pour votre demande ! Nous vous contacterons dans les 24 heures avec des informations sur les prix de gros.',
      },
      required: {
        en: 'Required',
        nl: 'Verplicht',
        de: 'Erforderlich',
        fr: 'Requis',
      },
    };
    
    return texts[key]?.[locale] || texts[key]?.en || key;
  };
  
  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          {locale === 'en' ? 'Inquiry Submitted!' : 
           locale === 'nl' ? 'Aanvraag Verzonden!' : 
           locale === 'de' ? 'Anfrage Gesendet!' : 
           'Demande Envoyée!'}
        </h3>
        <p className="text-green-700">
          {getText('success')}
        </p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            {getText('companyName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
            {getText('contactName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {getText('email')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            {getText('phone')} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            {getText('country')} <span className="text-red-500">*</span>
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            <option value="">-- {locale === 'en' ? 'Select' : locale === 'nl' ? 'Selecteer' : locale === 'de' ? 'Auswählen' : 'Sélectionner'} --</option>
            <option value="NL">Netherlands</option>
            <option value="DE">Germany</option>
            <option value="BE">Belgium</option>
            <option value="FR">France</option>
            <option value="UK">United Kingdom</option>
            <option value="ES">Spain</option>
            <option value="IT">Italy</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="kvkNumber" className="block text-sm font-medium text-gray-700 mb-1">
            {getText('kvkNumber')}
          </label>
          <input
            type="text"
            id="kvkNumber"
            name="kvkNumber"
            value={formData.kvkNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700 mb-1">
            {getText('vatNumber')}
          </label>
          <input
            type="text"
            id="vatNumber"
            name="vatNumber"
            value={formData.vatNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          {getText('message')} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        ></textarea>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-6 py-3 rounded-md font-medium text-white transition-colors ${
            isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSubmitting ? getText('submitting') : getText('submit')}
        </button>
      </div>
    </form>
  );
}
