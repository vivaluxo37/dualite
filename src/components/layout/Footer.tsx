import { Link } from 'react-router-dom'
import { BrokerAnalysisLogo } from './BrokerAnalysisLogo'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <BrokerAnalysisLogo className="h-8 w-8" />
              <span className="font-bold text-xl">BrokerAnalysis</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transparent broker analysis, intelligent recommendations, and powerful tools to empower traders worldwide.
            </p>
            <div className="pt-2">
              <h4 className="font-semibold text-sm mb-2">Subscribe to our newsletter</h4>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="email" placeholder="Email" className="h-9" />
                <Button type="submit" size="sm">Subscribe</Button>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold mb-4 text-foreground">Find Brokers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/brokers/usa" className="text-muted-foreground hover:text-primary">USA Brokers</Link></li>
              <li><Link to="/brokers/uk" className="text-muted-foreground hover:text-primary">UK Brokers</Link></li>
              <li><Link to="/brokers/australia" className="text-muted-foreground hover:text-primary">Australia Brokers</Link></li>
              <li><Link to="/brokers" className="text-muted-foreground hover:text-primary">All Brokers</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold mb-4 text-foreground">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ai-match" className="text-muted-foreground hover:text-primary">AI Broker Matcher</Link></li>
              <li><Link to="/compare" className="text-muted-foreground hover:text-primary">Broker Comparison</Link></li>
              <li><Link to="/calculators" className="text-muted-foreground hover:text-primary">Trading Calculators</Link></li>
              <li><Link to="/simulator" className="text-muted-foreground hover:text-primary">Cost Simulator</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/learn" className="text-muted-foreground hover:text-primary">Trading Education</Link></li>
              <li><Link to="/regulation-guide" className="text-muted-foreground hover:text-primary">Regulation Guide</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">How We Rate Brokers</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <div className="order-2 sm:order-1 mt-4 sm:mt-0">
              <p>&copy; {new Date().getFullYear()} BrokerAnalysis. All rights reserved.</p>
              <p>30 N Gould St Ste R, Sheridan, WY 82801, US. EIN: 384298140</p>
            </div>
            <div className="order-1 sm:order-2 space-x-4">
              <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/70 mt-6 text-center max-w-4xl mx-auto">
            Disclaimer: Trading foreign exchange on margin carries a high level of risk, and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to invest in foreign exchange you should carefully consider your investment objectives, level of experience, and risk appetite.
          </p>
        </div>
      </div>
    </footer>
  )
}
