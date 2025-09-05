import { motion } from 'framer-motion';
import { Users, CheckCircle, Scale } from 'lucide-react';

const stats = [
  {
    value: '100+',
    label: 'Regulated Brokers',
    icon: <Scale className="w-8 h-8 text-primary" />,
  },
  {
    value: '50,000+',
    label: 'Traders Matched',
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    value: '1,200+',
    label: 'Data Points Analyzed',
    icon: <CheckCircle className="w-8 h-8 text-primary" />,
  },
];

export function Stats() {
  return (
    <section className="py-16 bg-secondary/50 border-y">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="mb-3">{stat.icon}</div>
              <p className="text-3xl md:text-4xl font-bold tracking-tighter">{stat.value}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
