import { motion } from 'framer-motion';

const regulators = [
  { name: 'FCA', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Financial_Conduct_Authority_logo.svg/320px-Financial_Conduct_Authority_logo.svg.png' },
  { name: 'CySEC', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/Cysec_logo.svg/320px-Cysec_logo.svg.png' },
  { name: 'ASIC', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/ASIC_logo.svg/320px-ASIC_logo.svg.png' },
  { name: 'FINRA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/FINRA_logo.svg/320px-FINRA_logo.svg.png' },
  { name: 'BaFin', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/BaFin_logo.svg/320px-BaFin_logo.svg.png' },
];

export function TrustBadges() {
  return (
    <section className="py-12 bg-secondary/50">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-8">
          Featuring Brokers Regulated By Top-Tier Authorities
        </h3>
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {regulators.map((regulator) => (
            <motion.img
              key={regulator.name}
              src={regulator.logo}
              alt={regulator.name}
              className="h-8 md:h-10 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 0.6 }}
              viewport={{ once: true }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
