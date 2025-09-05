import React, { useState } from 'react'
		import { Link } from 'react-router-dom'
		import { Button } from '@/components/ui/button'
		import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
		import {
		  Accordion,
		  AccordionContent,
		  AccordionItem,
		  AccordionTrigger,
		} from "@/components/ui/accordion"
		import { Menu, Bot, Scale, Calculator, TestTube2, BookOpen, Shield, Milestone, MessageSquare, Info, Globe, LogOut, LayoutDashboard, User, LogIn, UserPlus } from 'lucide-react'
		import { useAuthContext } from '@/contexts/AuthContext'
		import { LoginDialog } from '../auth/LoginDialog'
		import { RegisterDialog } from '../auth/RegisterDialog'
		import { BrokerAnalysisLogo } from './BrokerAnalysisLogo'

		const navItems = [
		  {
		    title: "Find Brokers",
		    items: [
		      { title: "USA Brokers", href: "/brokers/usa", icon: <Globe /> },
		      { title: "UK Brokers", href: "/brokers/uk", icon: <Globe /> },
		      { title: "Australia Brokers", href: "/brokers/australia", icon: <Globe /> },
		      { title: "Scalping Brokers", href: "/brokers/style/scalping", icon: <Milestone /> },
		      { title: "ECN Brokers", href: "/brokers/style/ecn", icon: <Milestone /> },
		    ]
		  },
		  {
		    title: "Tools & Analysis",
		    items: [
		      { title: "AI Broker Matcher", href: "/ai-match", icon: <Bot /> },
		      { title: "Broker Comparison", href: "/compare", icon: <Scale /> },
		      { title: "Trading Calculators", href: "/calculators", icon: <Calculator /> },
		      { title: "Cost Simulator", href: "/simulator", icon: <TestTube2 /> },
		    ]
		  },
		  {
		    title: "Resources",
		    items: [
		      { title: "How We Rate Brokers", href: "/about", icon: <Scale /> },
		      { title: "Regulation Guide", href: "/regulation-guide", icon: <Shield /> },
		      { title: "Trading Education", href: "/learn", icon: <BookOpen /> },
		    ]
		  },
		  {
		    title: "Support",
		    items: [
		      { title: "Contact Us", href: "/contact", icon: <MessageSquare /> },
		      { title: "FAQ", href: "/faq", icon: <Info /> },
		    ]
		  }
		];

		export function MobileNav() {
		  const [isOpen, setIsOpen] = useState(false)
		  const { user, signOut } = useAuthContext()
		  const [loginOpen, setLoginOpen] = useState(false)
		  const [registerOpen, setRegisterOpen] = useState(false)

		  const handleSignOut = () => {
		    signOut();
		    setIsOpen(false);
		  }

		  return (
		    <>
		      <Sheet open={isOpen} onOpenChange={setIsOpen}>
		        <SheetTrigger asChild>
		          <Button variant="ghost" size="icon" className="lg:hidden">
		            <Menu className="h-6 w-6" />
		            <span className="sr-only">Toggle Menu</span>
		          </Button>
		        </SheetTrigger>
		        <SheetContent side="left" className="w-full sm:w-[320px] p-0">
		          <div className="flex flex-col h-full">
		            <div className="p-4 border-b">
		              <Link to="/" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
		                <BrokerAnalysisLogo className="h-8 w-8" />
		                <span className="font-bold text-xl text-foreground">BrokerAnalysis</span>
		              </Link>
		            </div>
		            <div className="flex-1 overflow-y-auto p-4">
		              <Accordion type="multiple" className="w-full">
		                {navItems.map((navGroup) => (
		                  <AccordionItem value={navGroup.title} key={navGroup.title}>
		                    <AccordionTrigger>{navGroup.title}</AccordionTrigger>
		                    <AccordionContent>
		                      <div className="flex flex-col space-y-1">
		                        {navGroup.items.map((item) => (
		                          <SheetClose asChild key={item.href}>
		                            <Link
		                              to={item.href}
		                              className="flex items-center gap-3 rounded-md p-2 text-sm hover:bg-accent"
		                            >
		                              {item.icon && React.cloneElement(item.icon, { className: 'h-4 w-4 text-muted-foreground' })}
		                              {item.title}
		                            </Link>
		                          </SheetClose>
		                        ))}
		                      </div>
		                    </AccordionContent>
		                  </AccordionItem>
		                ))}
		              </Accordion>
		            </div>
		            <div className="p-4 border-t mt-auto">
		              {user ? (
		                <div className="space-y-2">
		                  <SheetClose asChild>
		                    <Link to="/dashboard" className="flex items-center w-full p-2 text-sm rounded-md hover:bg-accent">
		                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
		                    </Link>
		                  </SheetClose>
		                  {user.user_metadata?.role === 'admin' && (
		                    <SheetClose asChild>
		                      <Link to="/admin" className="flex items-center w-full p-2 text-sm rounded-md hover:bg-accent">
		                        <User className="mr-2 h-4 w-4" /> Admin Panel
		                      </Link>
		                    </SheetClose>
		                  )}
		                  <Button variant="ghost" className="w-full justify-start p-2" onClick={handleSignOut}>
		                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
		                  </Button>
		                </div>
		              ) : (
		                <div className="space-y-2">
		                  <Button variant="outline" className="w-full" onClick={() => { setLoginOpen(true); setIsOpen(false); }}>
		                    <LogIn className="mr-2 h-4 w-4" /> Log In
		                  </Button>
		                  <Button className="w-full" onClick={() => { setRegisterOpen(true); setIsOpen(false); }}>
		                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
		                  </Button>
		                </div>
		              )}
		            </div>
		          </div>
		        </SheetContent>
		      </Sheet>
		      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
		      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} />
		    </>
		  )
		}
