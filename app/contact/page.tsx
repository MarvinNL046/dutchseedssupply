import React from 'react';
import InfoPageLayout from '@/components/layouts/InfoPageLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock 
} from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Dutch Seed Supply',
  description: 'Get in touch with our team for any questions, support, or feedback.',
};

export default function ContactPage() {
  return (
    <InfoPageLayout title="Contact Us">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="mb-6">
            Have questions about our products or need assistance with your order? 
            Our customer service team is here to help. Fill out the form and we'll 
            get back to you as soon as possible.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <Mail className="w-5 h-5 mr-3 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p>info@dutchseedsupply.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="w-5 h-5 mr-3 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p>+31 (0) 20 123 4567</p>
                <p className="text-sm text-muted-foreground">Monday to Friday, 9am to 5pm CET</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">Address</h3>
                <p>Dutch Seed Supply B.V.</p>
                <p>Keizersgracht 123</p>
                <p>1015 CJ Amsterdam</p>
                <p>The Netherlands</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="w-5 h-5 mr-3 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">Business Hours</h3>
                <p>Monday to Friday: 9:00 AM - 5:00 PM CET</p>
                <p>Saturday & Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input id="subject" placeholder="How can we help you?" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  placeholder="Please provide as much detail as possible..." 
                  rows={5}
                />
              </div>
              
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </InfoPageLayout>
  );
}
