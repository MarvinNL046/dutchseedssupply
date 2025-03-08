'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Leaf, 
  Sprout, 
  Flower, 
  Sun, 
  Scissors 
} from "lucide-react";

// Define the growing stages
const growingStages = [
  {
    id: "germination",
    name: "Germination",
    icon: Sprout,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-950",
    duration: "2-7 days",
    description: "The first stage where your seeds sprout and develop their first root.",
    tips: [
      "Use the paper towel method or plant directly in soil",
      "Keep temperature between 21-26°C (70-80°F)",
      "Maintain high humidity (70-90%)",
      "Avoid touching the fragile taproot",
      "Ensure darkness until sprouting occurs"
    ]
  },
  {
    id: "seedling",
    name: "Seedling",
    icon: Leaf,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100 dark:bg-emerald-950",
    duration: "2-3 weeks",
    description: "Young plants develop their first true leaves and establish their root system.",
    tips: [
      "Provide 18-24 hours of light daily",
      "Keep humidity around 65-70%",
      "Water sparingly around the stem",
      "Use a small fan for gentle air circulation",
      "Begin very light nutrients (¼ strength)"
    ]
  },
  {
    id: "vegetative",
    name: "Vegetative",
    icon: Sun,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-950",
    duration: "3-8 weeks",
    description: "Plants focus on growing stems, branches, and leaves to prepare for flowering.",
    tips: [
      "Maintain 18 hours of light daily",
      "Reduce humidity to 40-60%",
      "Increase watering as plants grow",
      "Begin regular feeding schedule",
      "Consider training techniques (LST, topping)"
    ]
  },
  {
    id: "flowering",
    name: "Flowering",
    icon: Flower,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-950",
    duration: "6-12 weeks",
    description: "Plants develop buds and resin glands, focusing energy on reproduction.",
    tips: [
      "Switch to 12 hours light/12 hours darkness",
      "Reduce nitrogen and increase phosphorus/potassium",
      "Lower humidity to 30-40% to prevent mold",
      "Support heavy branches with stakes or nets",
      "Monitor trichomes for harvest readiness"
    ]
  },
  {
    id: "harvesting",
    name: "Harvesting",
    icon: Scissors,
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-950",
    duration: "1-2 weeks",
    description: "The final stage where you collect the fruits of your labor.",
    tips: [
      "Harvest when trichomes are cloudy (THC) or amber (CBD)",
      "Cut whole plant or harvest in sections",
      "Trim excess leaves while fresh or after drying",
      "Dry slowly in 60-70°F with 45-55% humidity",
      "Cure in glass jars for 2+ weeks for best flavor"
    ]
  }
];

export default function GrowingGuide() {
  return (
    <div id="growing-guide" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Cannabis Growing Guide</h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          Follow these steps to grow healthy plants and achieve a successful harvest with your cannabis seeds.
        </p>
        
        <Tabs defaultValue="germination" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            {growingStages.map((stage) => {
              const IconComponent = stage.icon;
              
              return (
                <TabsTrigger 
                  key={stage.id} 
                  value={stage.id}
                  className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-950"
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{stage.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {growingStages.map((stage) => {
            const IconComponent = stage.icon;
            
            return (
              <TabsContent key={stage.id} value={stage.id}>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 flex flex-col items-center text-center">
                        <div className={`p-4 rounded-full ${stage.bgColor} mb-4`}>
                          <IconComponent className={`h-12 w-12 ${stage.color}`} />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">{stage.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{stage.description}</p>
                        <p className="font-medium">
                          <span className="text-gray-500">Duration:</span> {stage.duration}
                        </p>
                      </div>
                      
                      <div className="md:w-2/3">
                        <h4 className="text-xl font-semibold mb-4">Growing Tips</h4>
                        <ul className="space-y-2">
                          {stage.tips.map((tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-600 mr-2">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
