import { Link } from "react-router-dom";
import { Bot, CreditCard, GraduationCap, Server, Sparkles, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/aiz-logo.jpeg";

const navLinks = [
  { name: "Services", href: "/service/ai-automation", icon: Bot },
  { name: "Plans", href: "/service/brand-building", icon: CreditCard },
  { name: "AI Academy", href: "/service/ai-academy", icon: GraduationCap },
  { name: "SaaS", href: "/service/saas-solutions", icon: Server },
  { name: "AI Systems", href: "/service/ai-systems", icon: Sparkles },
  { name: "Support", href: "/service/ai-marketing", icon: HeadphonesIcon },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src={logo} 
              alt="AIZboostr" 
              className="h-10 sm:h-12 w-auto mix-blend-multiply transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Navigation - Always visible */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="flex items-center gap-1 px-1.5 sm:px-3 py-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <link.icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden md:inline">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
