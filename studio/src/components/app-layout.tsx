
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bookmark, Code2, Home, PlusSquare, ShieldCheck, LogIn, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const navItems = [
  { href: '/', label: 'Home', icon: Home, requiresAuth: false },
  { href: '/create', label: 'Create Post', icon: PlusSquare, requiresAuth: true },
  { href: '/saved', label: 'Saved', icon: Bookmark, requiresAuth: false },
  { href: '/admin', label: 'Admin', icon: ShieldCheck, requiresAuth: true, adminOnly: true },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Filter nav items based on auth status
  const visibleNavItems = navItems.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  // Don't show sidebar on login/register pages
  if (pathname === '/login' || pathname === '/register') {
    return <main>{children}</main>;
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full bg-background">
        <aside className="fixed left-0 top-0 z-10 flex h-full flex-col border-r bg-card transition-all w-16 hover:w-56 group">
          <div className="flex h-16 items-center justify-start border-b px-4 overflow-hidden">
            <Link href="/" className="flex items-center gap-2 font-headline font-semibold text-primary whitespace-nowrap">
              <Code2 className="h-7 w-7 flex-shrink-0" />
              <span className="hidden group-hover:inline-block transition-all">Code Scroller</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-2 overflow-auto px-4 py-4">
            {visibleNavItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex h-10 items-center justify-center gap-3 rounded-lg px-3 text-muted-foreground transition-colors hover:text-primary hover:bg-muted',
                      pathname === item.href && 'bg-muted text-primary',
                      "group-hover:justify-start"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only group-hover:not-sr-only transition-opacity opacity-0 group-hover:opacity-100">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
          <div className="mt-auto flex flex-col items-center gap-4 border-t p-4">
             <div className="w-full flex justify-center group-hover:justify-start">
                 <ThemeToggle />
             </div>
             <div className="w-full flex justify-center group-hover:justify-start">
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full flex items-center gap-3 justify-center group-hover:justify-start">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={user.photoURL || undefined} />
                          <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="sr-only group-hover:not-sr-only transition-opacity opacity-0 group-hover:opacity-100 truncate">
                          {user.displayName || user.email}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => router.push('/admin')}>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Admin Panel
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login" className="flex items-center gap-3 justify-center group-hover:justify-start">
                      <LogIn className="h-4 w-4" />
                      <span className="sr-only group-hover:not-sr-only">Login</span>
                    </Link>
                  </Button>
                )}
             </div>
          </div>
        </aside>
        <main className="flex-1 pl-16 transition-all">{children}</main>
      </div>
    </TooltipProvider>
  );
}
