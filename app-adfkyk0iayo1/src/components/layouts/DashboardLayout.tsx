import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, MessageSquare, FileText, Bell, User, LogOut, Menu, Settings, ArrowRight, Brain } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Schemes', href: '/schemes', icon: FileText },
  { name: 'AI Assistant', href: '/chat', icon: MessageSquare },
  { name: 'AI KNOW', href: 'https://scheme-sand.vercel.app', icon: Brain, external: true },
  { name: 'Notifications', href: '/notifications', icon: Bell },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const adminLink = profile?.role === 'admin' ? { name: 'Admin', href: '/admin', icon: Settings } : null;

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center px-6">
                      <span className="text-xl font-semibold">Citizen Seva</span>
                    </div>
                    <nav className="flex-1 space-y-1 p-4">
                      {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        if (item.external) {
                          return (
                            <a
                              key={item.name}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <item.icon className="h-4 w-4" />
                              {item.name}
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                          </Link>
                        );
                      })}
                      {adminLink && (
                        <Link
                          to={adminLink.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            location.pathname === adminLink.href
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <adminLink.icon className="h-4 w-4" />
                          {adminLink.name}
                        </Link>
                      )}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link to="/dashboard" className="text-xl font-semibold">
                Citizen Seva
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden items-center gap-8 lg:flex">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  if (item.external) {
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.name}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                {adminLink && (
                  <Link
                    to={adminLink.href}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === adminLink.href
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {adminLink.name}
                  </Link>
                )}
              </nav>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{profile?.name || 'User'}</span>
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {profile?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container-custom py-8">{children}</div>
      </main>
    </div>
  );
}
