import { motion } from 'framer-motion';
import { Eye, Bot, Beaker } from 'lucide-react';

const propositions = [
  {
    icon: <Eye className="w-10 h-10 text-primary" />,
    title: "Radical Transparency",
    description: "We believe in clarity. Our ratings, reviews, and data are presented without bias, so you know exactly what you're getting.",
  },
  {
    icon: <Bot className="w-10 h-10 text-primary" />,
    title: "AI-Driven Insights",
    description: "Leverage the power of machine learning to find brokers that perfectly match your unique trading profile and goals.",
  },
  {
    icon: <Beaker className="w-10 h-10 text-primary" />,
    title: "Free, Powerful Tools",
    description: "From advanced cost simulators to profit calculators, our suite of tools is designed to give you a professional edge, for free.",
  },
];

export function ValuePropositions() {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          {propositions.map((prop, index) => (
            <motion.div
              key={prop.title}
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-background border flex items-center justify-center">
                  {prop.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{prop.title}</h3>
              <p className="text-muted-foreground">{prop.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
