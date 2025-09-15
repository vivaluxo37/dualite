import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1651499833076-4caeb8324708?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMGdyYWRpZW50JTIwcGF0dGVybnxlbnwwfDB8fGJsdWV8MTc1NzgzOTQ1M3ww&ixlib=rb-4.1.0&q=85')] bg-cover bg-center opacity-10"
          style={{width: '100%', height: '100%'}}
          title="Abstract geometric pattern by Visax on Unsplash"
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-500/10 rounded-full blur-xl"
          animate={{
            y: [0, -15, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm mb-8 shadow-lg"
        >
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-gray-700">Trusted by 50,000+ Traders Worldwide</span>
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-display mb-8 text-gray-900 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Find Your Perfect{' '}
          <span className="gradient-text">Forex Broker</span>{' '}
          with AI Precision
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-subheading text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Stop guessing. Our AI analyzes 100+ regulated brokers across 1,200+ data points to match you with brokers that fit your exact trading style and goals.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            size="lg"
            asChild
            className="modern-button text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl"
          >
            <Link to="/ai-match" className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Start AI Broker Match
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="modern-button text-lg px-8 py-6 h-auto border-2 hover:bg-gray-50"
          >
            <Link to="/brokers" className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Explore All Brokers
            </Link>
          </Button>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="glass-card rounded-2xl p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
            <div className="text-sm text-gray-600">Regulated Brokers</div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
            <div className="text-sm text-gray-600">Traders Matched</div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">1,200+</div>
            <div className="text-sm text-gray-600">Data Points</div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}