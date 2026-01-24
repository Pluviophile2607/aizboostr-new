import { Link } from "react-router-dom";
import { Instagram, Youtube } from "lucide-react";
import { useTheme } from "./theme-provider";
import GradientText from "./GradientText";
const logo = "https://cdn.designfast.io/image/2026-01-23/65dae496-1d36-49d7-8c86-12bd2553c489.jpeg";

const footerLinks = {
  Services: [
    { name: "AI Marketing", href: "#services" },
    { name: "AI Automation", href: "#services" },
    { name: "Video Ads", href: "#video-ads" },
  ],
  Company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press", href: "#" },
  ],
  Resources: [
    { name: "Documentation", href: "#" },
    { name: "API Reference", href: "#" },
    { name: "Community", href: "#" },
    { name: "Support", href: "#support" },
  ],
  // Legal: [
  //   { name: "Privacy Policy", href: "#" },
  //   { name: "Terms of Service", href: "#" },
  //   { name: "Cookie Policy", href: "#" },
  //   { name: "GDPR", href: "#" },
  // ],
};

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/aizboostr?igsh=dHJhbjF2eWdiN2J6&utm_source=qr", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  const { theme } = useTheme();
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            {theme === "dark" ? (
              <div className="mb-6">
                <GradientText
                  colors={["#5227FF", "#FF9FFC", "#B19EEF", "#ff00d0", "#5227FF"]}
                  animationSpeed={3}
                  className="text-2xl font-bold px-5 py-2"
                  showBorder={false}
                >
                  AiZboostr
                </GradientText>
              </div>
            ) : (
              <img src={logo} alt="AIZboostr" className="h-12 w-auto mb-6" loading="lazy" />
            )}
            <p className="text-muted-foreground mb-6 max-w-xs">
              AI Powered Brand Building Brand. Transform your business with cutting-edge AI solutions.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4 text-foreground">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Stay Updated</h4>
              <p className="text-sm text-muted-foreground">
                Get the latest AI insights and updates delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground text-sm w-full sm:w-64 text-foreground"
              />
              <button className="px-6 py-2 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AIZboostr. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Made with <span className="text-foreground">♥</span> by ZED
          </p>
        </div>
      </div>
    </footer>
  );
}