import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const faqItems = [
  {
    question: "How does the Trust Score work?",
    answer: "Our Trust Score is a proprietary algorithm that evaluates brokers based on factors like regulatory licenses, years in business, public complaints, and withdrawal speed. It gives you a simple, data-driven metric for a broker's reliability."
  },
  {
    question: "Is BrokerAnalysis free to use?",
    answer: "Yes, all our comparison tools, reviews, and educational resources are completely free for users. We may earn a commission if you open an account with a broker through our affiliate links, but this does not affect our ratings or your costs."
  },
  {
    question: "How do you verify user reviews?",
    answer: "We encourage users to optionally upload proof of their trading account (like a redacted statement) to get a 'Verified' badge on their review. This helps ensure the authenticity of the feedback you read."
  },
  {
    question: "How does the AI Broker Matcher work?",
    answer: "Our AI quiz asks about your trading experience, style, preferred instruments, and deposit size. It then uses a machine learning model to cross-reference this with our extensive broker database to recommend the top 3 brokers that best fit your profile."
  },
  {
    question: "How often is the broker data updated?",
    answer: "We strive to update our data, including spreads, fees, and regulatory status, on a quarterly basis. However, we always recommend verifying the latest information directly on the broker's website."
  },
  {
    question: "Can I request a review for a broker not listed?",
    answer: "Absolutely! Please use our contact form to suggest a broker. We are constantly expanding our database and prioritize requests from our community."
  },
];

export function Faq() {

  return (
    <section id="faq" className="py-24 border-t">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our platform and how we operate.
            </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <Button asChild>
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
