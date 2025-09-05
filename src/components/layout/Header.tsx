import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { BrokerAnalysisLogo } from './BrokerAnalysisLogo'
import { User, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { LoginDialog } from '@/components/auth/LoginDialog'
import { RegisterDialog } from '@/components/auth/RegisterDialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/contexts/ThemeContext'
import { Navigation } from './Navigation'
import { MobileNav } from './MobileNav'

export function Header() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const { user, signOut } = useAuthContext()
  const { theme, setTheme } = useTheme()

  const getAvatarFallback = (name?: string | null) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3">
              <BrokerAnalysisLogo className="h-8 w-8" />
              <span className="font-bold text-xl sm:text-2xl text-foreground">BrokerAnalysis</span>
            </Link>

            <div className="hidden lg:flex flex-1 items-center justify-center">
              <Navigation />
            </div>

            <div className="hidden lg:flex items-center gap-2">
               <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.display_name} />
                        <AvatarFallback>{getAvatarFallback(user.user_metadata?.display_name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <p className="font-medium">{user.user_metadata?.display_name || 'My Account'}</p>
                      <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                    </DropdownMenuItem>
                    {user.user_metadata?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin"><User className="mr-2 h-4 w-4" /> Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setLoginOpen(true)}>Log In</Button>
                  <Button onClick={() => setRegisterOpen(true)}>Sign Up</Button>
                </>
              )}
            </div>

            <div className="lg:hidden flex items-center">
               <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <MobileNav />
            </div>
          </div>
        </div>
      </header>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} />
    </>
  )
}
