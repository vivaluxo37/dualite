import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { BarChart, Search, Puzzle, ShieldCheck, Scale, GraduationCap } from 'lucide-react';

const featuresList = [
  {
    icon: <Search className="w-8 h-8 text-primary" />,
    title: "Advanced Comparison",
    description: "Filter and sort brokers by fees, platforms, regulation, and more to find your perfect match.",
  },
  {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: "Data-Driven Trust Score",
    description: "Our unique algorithm scores brokers based on regulation, history, and user feedback.",
  },
  {
    icon: <Puzzle className="w-8 h-8 text-primary" />,
    title: "AI Broker Matching Quiz",
    description: "Answer a few questions and let our AI recommend the top 3 brokers for your trading style.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Verified User Reviews",
    description: "Read authentic reviews from real traders, with optional proof of trading activity.",
  },
  {
    icon: <Scale className="w-8 h-8 text-primary" />,
    title: "Unbiased Analysis",
    description: "We provide objective, in-depth analysis to help you understand the pros and cons of each broker.",
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-primary" />,
    title: "Gamified Learning Hub",
    description: "Learn forex trading from beginner to pro with our interactive modules and quizzes.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter">Everything You Need to Choose with Confidence</h2>
          <p className="text-lg text-muted-foreground">
            Our platform is packed with powerful features to simplify your research and empower your trading journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:border-primary transition-colors">
                <CardHeader>
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="pt-2">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
