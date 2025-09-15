import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DualiteLogo } from './BrokerAnalysisLogo';
import { useAuth } from '@clerk/clerk-react';
import { ClerkAuthDialog } from '@/components/auth/ClerkAuthDialog';
import { ClerkUserProfile } from '@/components/auth/ClerkUserProfile';
import { Navigation } from './Navigation';
import { MobileNav } from './MobileNav';

export function Header() {
  const [authOpen, setAuthOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <DualiteLogo className="h-8 w-8" />
              </motion.div>
              <span className="font-bold text-xl sm:text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">
                BrokerAnalysis
              </span>
            </Link>

            <div className="hidden lg:flex flex-1 items-center justify-center">
              <Navigation />
            </div>

            <div className="hidden lg:flex items-center">
              {isLoaded && isSignedIn ? (
                <ClerkUserProfile />
              ) : (
                <Button
                  onClick={() => setAuthOpen(true)}
                  className="modern-button bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                >
                  Sign In
                </Button>
              )}
            </div>

            <div className="lg:hidden flex items-center">
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      <ClerkAuthDialog isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}