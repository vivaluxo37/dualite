import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-24 text-center overflow-hidden bg-dot-black/[0.1] dark:bg-dot-white/[0.1]">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm mb-6 bg-secondary/50"
        >
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Your Trusted Guide in Forex Trading</span>
        </motion.div>
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Intelligent Broker<br /> Recommendations
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Let our AI find the perfect broker for your trading style. Make confident decisions with unbiased reviews and powerful comparison tools.
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <Link to="/ai-match">
              Start AI Broker Match <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
           <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
            <Link to="/brokers">
              Explore All Brokers
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
