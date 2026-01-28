import React from "react";

interface SkipLink {
  href: string;
  label: string;
}

const defaultLinks: SkipLink[] = [
  { href: "#main-content", label: "Skip to main content" },
  { href: "#patient-alerts", label: "Skip to patient alerts" },
];

interface SkipLinksProps {
  links?: SkipLink[];
}

export const SkipLinks: React.FC<SkipLinksProps> = ({ links = defaultLinks }) => {
  return (
    <nav aria-label="Skip links" className="sr-only focus-within:not-sr-only">
      <ul className="fixed top-0 left-0 z-[100] flex gap-2 p-2 bg-background">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="inline-block px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
