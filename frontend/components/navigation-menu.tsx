"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserRole } from "@/lib/interfaces";

// Navigation links configuration
const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
  { href: "/cgu", label: "CGU" },
];

const FREELANCE_LINKS: { href: string; label: string }[] = [
  { href: "/job-postings/search", label: "Jobs" },
];

const COMPANY_LINKS: { href: string; label: string }[] = [
  { href: "/freelances/search", label: "Freelances" },
];

// Auth links configuration
const AUTH_LINKS = [
  { href: "/login", label: "Se connecter", variant: "outline" },
  { href: "/register/choice", label: "S'inscrire", variant: "default" },
];

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, checkAuth } = useAuth();
  const pathname = usePathname();

  // Re-vérifier l'authentification à chaque changement d'URL
  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  const getHomeUrl = () => {
    if (!user) return "/";

    if (user.role === UserRole.FREELANCE) return "/dashboard/freelance";
    if (user.role === UserRole.COMPANY) return "/dashboard/company";

    return "/";
  };

  const userRole = user?.role === UserRole.FREELANCE ? "freelance" : "company";
  // Authenticated user links
  const USER_LINKS = [
    { href: "/dashboard/" + userRole, label: "Dashboard", variant: "outline" },
    { href: "/logout", label: "Déconnexion", variant: "default" },
  ];

  const NavLinks = ({ mobile = false, onClick = () => {} }) => {
    const getNavLinks = () => {
      if (!user) return NAV_LINKS;

      if (user.role === UserRole.FREELANCE) return FREELANCE_LINKS;
      if (user.role === UserRole.COMPANY) return COMPANY_LINKS;

      return NAV_LINKS;
    };

    return (
      <>
        {getNavLinks().map((link, index) => (
          <Link
            key={`${link.label}-${index}`}
            href={link.href}
            className={`font-medium transition-colors hover:text-primary ${
              mobile ? "text-lg" : "text-sm"
            }`}
            onClick={onClick}
          >
            {link.label}
          </Link>
        ))}
      </>
    );
  };

  const AuthButtons = ({ mobile = false }) => (
    <>
      {AUTH_LINKS.map((link, index) => {
        const isOutline = link.variant === "outline";

        return (
          <Button
            key={`${link.label}-${index}`}
            variant={isOutline ? "outline" : "default"}
            className={`
              ${mobile ? "w-full" : ""}
              ${
                isOutline
                  ? "text-foreground hover:bg-accent hover:text-accent-foreground"
                  : "bg-freehunt-black-two text-white hover:bg-black/90"
              }
              rounded-lg
            `}
            asChild
          >
            <Link href={link.href} onClick={() => mobile && setIsOpen(false)}>
              {link.label}
            </Link>
          </Button>
        );
      })}
    </>
  );

  const UserButtons = ({ mobile = false }) => (
    <>
      {USER_LINKS.map((link, index) => {
        const isOutline = link.variant === "outline";

        return (
          <Button
            key={`${link.label}-${index}`}
            variant={isOutline ? "outline" : "default"}
            className={`${mobile ? "w-full" : ""} rounded-lg`}
            asChild
          >
            <Link href={link.href} onClick={() => mobile && setIsOpen(false)}>
              {link.label}
            </Link>
          </Button>
        );
      })}
    </>
  );

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 flex border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-8">
        <div className="flex flex-1 justify-between h-16 items-center">
          <div className="flex items-center gap-10">
            <Link href={getHomeUrl()}>
              <span className="text-xl font-bold">FreeHunt</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <NavLinks />
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-8">
      <div className="flex flex-1 justify-between h-16 items-center">
        <div className="flex items-center gap-10">
          <Link href={getHomeUrl()}>
            <span className="text-xl font-bold">FreeHunt</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? <UserButtons /> : <AuthButtons />}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] [&>button:first-of-type]:hidden"
          >
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b pb-4">
                <Link
                  href={getHomeUrl()}
                  className="flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl font-bold">FreeHunt</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="flex flex-col gap-4 py-6">
                <NavLinks mobile onClick={() => setIsOpen(false)} />
              </nav>
              <div className="mt-auto flex flex-col gap-4 border-t pt-6">
                {user ? <UserButtons mobile /> : <AuthButtons mobile />}
              </div>
              {user && (
                <div className="text-sm text-gray-600 mt-2 text-center">
                  Connecté en tant que {user.username}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
