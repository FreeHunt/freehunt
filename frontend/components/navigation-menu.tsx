"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/actions/auth"; // Utilisez votre hook existant

// Navigation links configuration
const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

// Auth links configuration
const AUTH_LINKS = [
  { href: "/login", label: "Se connecter", variant: "outline" },
  { href: "/register/choice", label: "S'inscrire", variant: "default" },
];

// Authenticated user links
const USER_LINKS = [
  { href: "/account", label: "Mon compte", variant: "outline" },
  { href: "/logout", label: "Déconnexion", variant: "default" },
];

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, checkAuth } = useAuth();
  const pathname = usePathname();

  // Re-vérifier l'authentification à chaque changement d'URL
  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  const NavLinks = ({ mobile = false, onClick = () => {} }) => (
    <>
      {NAV_LINKS.map((link, index) => (
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
              rounded-full
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
            className={`${mobile ? "w-full" : ""} rounded-full`}
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
            <Link href="/">
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
          <Link href="/">
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
                  href="/"
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
