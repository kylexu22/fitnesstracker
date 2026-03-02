"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FolderKanban, History, Home } from "lucide-react";

const desktopLinks = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/templates", label: "Builder", icon: FolderKanban },
  { href: "/history", label: "History", icon: History },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const mobileLinks = [
  { href: "/", icon: Home },
  { href: "/history", icon: History },
  { href: "/templates", icon: FolderKanban },
  { href: "/analytics", icon: BarChart3 },
];

function isRouteActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();
  const activeIndex = mobileLinks.findIndex((link) => isRouteActive(pathname, link.href));

  return (
    <>
      <nav className="hidden items-center gap-2 rounded-2xl border border-border bg-card/90 p-2 md:flex">
        {desktopLinks.map((link) => {
          const Icon = link.icon;
          const active = isRouteActive(pathname, link.href);

          return (
            <Link key={link.href} href={link.href} className={`nav-pill ${active ? "nav-pill-active" : ""}`}>
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <nav className="mobile-nav md:hidden" aria-label="Mobile navigation">
        <div className="mobile-nav-track" style={{ gridTemplateColumns: `repeat(${mobileLinks.length}, minmax(0, 1fr))` }}>
          {activeIndex >= 0 ? (
            <span
              className="mobile-nav-indicator"
              style={{
                width: `${100 / mobileLinks.length}%`,
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            >
            <span className="mobile-nav-dot" />
            </span>
          ) : null}
          {mobileLinks.map((link) => {
            const Icon = link.icon;
            const active = isRouteActive(pathname, link.href);
            return (
              <Link key={link.href} href={link.href} className={`mobile-nav-item ${active ? "mobile-nav-item-active" : ""}`}>
                <Icon className="h-6 w-6" />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
