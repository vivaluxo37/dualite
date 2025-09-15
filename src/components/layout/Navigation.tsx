import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Scale,
  Milestone,
  Globe,
  Shield,
  Bot,
  TestTube2,
  Calculator,
  BookOpen,
  MessageSquare,
  Info,
  Star,
  MapPin,
  TrendingUp,
  GraduationCap
} from "lucide-react";

const featuredBrokers = [
  {
    title: "IG Group",
    href: "/review/ig-group",
    description: "UK-based global leader in online trading",
    icon: <Star className="w-4 h-4 text-yellow-500" />
  },
  {
    title: "OANDA",
    href: "/review/oanda",
    description: "Innovative forex and CFD broker",
    icon: <Star className="w-4 h-4 text-yellow-500" />
  },
];

const topCountries = [
  { title: "USA Brokers", href: "/brokers/usa", description: "CFTC/NFA regulated brokers" },
  { title: "UK Brokers", href: "/brokers/uk", description: "FCA regulated brokers" },
  { title: "Australia Brokers", href: "/brokers/australia", description: "ASIC regulated brokers" },
  { title: "Canada Brokers", href: "/brokers/canada", description: "IIROC regulated brokers" },
];

const popularStyles = [
  { title: "ECN Brokers", href: "/brokers/style/ecn", description: "Direct market access" },
  { title: "Scalping Brokers", href: "/forex-brokers/trading-types/scalping", description: "For high-frequency traders" },
  { title: "Islamic Accounts", href: "/brokers/style/islamic", description: "Sharia-compliant trading" },
  { title: "Beginners Brokers", href: "/brokers/style/beginners", description: "Demo accounts & education" },
];

const allRegions = [
  { title: "North America", href: "/brokers/north-america", description: "USA & Canada brokers" },
  { title: "Europe", href: "/brokers/europe", description: "UK & EU regulated brokers" },
  { title: "Asia Pacific", href: "/brokers/asia-pacific", description: "Australia, Singapore & Asian markets" },
  { title: "Middle East & Africa", href: "/brokers/middle-east-africa", description: "Dubai, South Africa & emerging markets" },
  { title: "South Asia", href: "/brokers/south-asia", description: "India, Pakistan, Nepal & regional brokers" },
];

const tradingStyles = [
  { title: "MT4 Brokers", href: "/brokers/style/mt4", description: "MetaTrader 4 platforms" },
  { title: "Low Spread Brokers", href: "/brokers/style/low-spread", description: "Competitive spreads" },
  { title: "Copy Trading", href: "/brokers/style/copy-trading", description: "Social trading platforms" },
  { title: "Auto Trading", href: "/brokers/style/auto-trading", description: "Algorithmic trading" },
  { title: "High Leverage", href: "/brokers/style/high-leverage", description: "Maximize your trading power" },
];

// Additional trading styles that can be used in region pages
const extendedTradingStyles = [
  ...tradingStyles,
  { title: "Beginner Brokers", href: "/forex-brokers/trading-types/beginners-forex-brokers.html", description: "Demo accounts & education" },
];

// Export extended trading styles for use in other components
export { extendedTradingStyles };

const tools = [
  {
    title: "AI Broker Matcher",
    href: "/ai-match",
    description: "Let our AI find the perfect broker for you",
    icon: <Bot />
  },
  {
    title: "Broker Comparison",
    href: "/compare",
    description: "Side-by-side analysis of top brokers",
    icon: <Scale />
  },
  {
    title: "Trading Calculators",
    href: "/calculators",
    description: "Pip, margin, profit calculators",
    icon: <Calculator />
  },
  {
    title: "Cost Simulator",
    href: "/simulator",
    description: "Analyze real trading costs across brokers",
    icon: <TestTube2 />
  },
];

const learningResources = [
  {
    title: "Trading Education",
    href: "/learn",
    description: "From beginner to pro strategies",
    icon: <GraduationCap />
  },
  {
    title: "Market Analysis",
    href: "/learn/market-analysis",
    description: "Latest insights and trends",
    icon: <TrendingUp />
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Latest forex trading insights and tips",
    icon: <BookOpen />
  },
  {
    title: "Regulation Guide",
    href: "/regulation-guide",
    description: "Understand broker regulation",
    icon: <Shield />
  },
  {
    title: "Broker Reviews",
    href: "/reviews",
    description: "In-depth broker analysis",
    icon: <Star />
  },
];

const support = [
  {
    title: "Contact Us",
    href: "/contact",
    description: "Get in touch with our team",
    icon: <MessageSquare />
  },
  {
    title: "FAQ",
    href: "/faq",
    description: "Find answers to common questions",
    icon: <Info />
  },
  {
    title: "Help Center",
    href: "/help",
    description: "Browse our knowledge base",
    icon: <BookOpen />
  },
];

export function Navigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Top Brokers</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4">
              <div>
                <h3 className="font-medium text-sm flex items-center gap-2 mb-2 px-3">
                  <Star className="w-4 h-4 text-yellow-500"/>Featured Brokers
                </h3>
                <ul className="grid gap-1">
                  {featuredBrokers.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      to={component.href}
                      icon={component.icon}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Find Brokers</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[700px] grid-cols-3 gap-4 p-4">
              <div>
                <h3 className="font-medium text-sm flex items-center gap-2 mb-2 px-3">
                  <Globe className="w-4 h-4"/>Top Countries
                </h3>
                <ul className="grid gap-1">
                  {topCountries.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      to={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-sm flex items-center gap-2 mb-2 px-3">
                  <Milestone className="w-4 h-4"/>Popular Styles
                </h3>
                <ul className="grid gap-1">
                  {popularStyles.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      to={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-sm flex items-center gap-2 mb-2 px-3">
                  <MapPin className="w-4 h-4"/>All Regions
                </h3>
                <ul className="grid gap-1">
                  {allRegions.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      to={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Tools & Analysis</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {tools.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  to={component.href}
                  icon={component.icon}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {learningResources.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  to={component.href}
                  icon={component.icon}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Support</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 md:w-[400px]">
              {support.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  to={component.href}
                  icon={component.icon}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & {
    icon?: React.ReactNode;
  }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {icon && <div className="text-muted-foreground">{icon}</div>}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className={cn(
            "line-clamp-2 text-sm leading-snug text-muted-foreground",
            icon && "pl-6"
          )}>
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";