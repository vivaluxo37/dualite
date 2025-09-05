import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Scale, Milestone, Globe, Shield, Bot, TestTube2, Calculator, BookOpen, MessageSquare, Info } from "lucide-react"

const countries = [
  { title: "USA Brokers", href: "/brokers/usa", description: "CFTC/NFA regulated brokers." },
  { title: "UK Brokers", href: "/brokers/uk", description: "FCA regulated brokers." },
  { title: "Australia Brokers", href: "/brokers/australia", description: "ASIC regulated brokers." },
  { title: "Canada Brokers", href: "/brokers/canada", description: "IIROC regulated brokers." },
  { title: "Singapore Brokers", href: "/brokers/singapore", description: "MAS regulated brokers." },
  { title: "South Africa Brokers", href: "/brokers/south-africa", description: "FSCA regulated brokers." },
]

const styles = [
  { title: "Scalping Brokers", href: "/brokers/style/scalping", description: "For high-frequency traders." },
  { title: "ECN Brokers", href: "/brokers/style/ecn", description: "Direct market access." },
  { title: "High Leverage", href: "/brokers/style/high-leverage", description: "Maximize your trading power." },
  { title: "Islamic Accounts", href: "/brokers/style/islamic", description: "Sharia-compliant trading." },
]

const tools = [
  { title: "AI Broker Matcher", href: "/ai-match", description: "Let our AI find the perfect broker for you.", icon: <Bot /> },
  { title: "Broker Comparison", href: "/compare", description: "Side-by-side analysis of top brokers.", icon: <Scale /> },
  { title: "Trading Calculators", href: "/calculators", description: "Pip, margin, profit, and more.", icon: <Calculator /> },
  { title: "Cost Simulator", href: "/simulator", description: "Analyze real trading costs across brokers.", icon: <TestTube2 /> },
]

const resources = [
  { title: "How We Rate Brokers", href: "/about", description: "Our transparent rating methodology.", icon: <Scale /> },
  { title: "Regulation Guide", href: "/regulation-guide", description: "Understand broker regulation.", icon: <Shield /> },
  { title: "Trading Education", href: "/learn", description: "From beginner to pro.", icon: <BookOpen /> },
  { title: "Market Analysis", href: "/learn/market-analysis", description: "Latest insights and trends.", icon: <Milestone /> },
]

const support = [
    { title: "Contact Us", href: "/contact", description: "Get in touch with our team.", icon: <MessageSquare /> },
    { title: "FAQ", href: "/faq", description: "Find answers to common questions.", icon: <Info /> },
    { title: "Help Center", href: "/help", description: "Browse our knowledge base.", icon: <BookOpen /> },
]

export function Navigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Find Brokers</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
              <div>
                <h3 className="font-medium text-sm flex items-center gap-2 mb-2 px-3"><Globe className="w-4 h-4"/>By Country</h3>
                <ul className="grid gap-1">
                  {countries.map((component) => (
                    <ListItem key={component.title} title={component.title} to={component.href}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-sm flex items-center gap-2 mb-2 px-3"><Milestone className="w-4 h-4"/>By Trading Style</h3>
                <ul className="grid gap-1">
                  {styles.map((component) => (
                    <ListItem key={component.title} title={component.title} to={component.href}>
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
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {tools.map((component) => (
                <ListItem key={component.title} title={component.title} to={component.href} icon={component.icon}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {resources.map((component) => (
                <ListItem key={component.title} title={component.title} to={component.href} icon={component.icon}>
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
                <ListItem key={component.title} title={component.title} to={component.href} icon={component.icon}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { icon?: React.ReactNode }
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
          <p className={cn("line-clamp-2 text-sm leading-snug text-muted-foreground", icon && "pl-6")}>
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
