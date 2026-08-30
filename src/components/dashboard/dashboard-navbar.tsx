"use client";

import Image from "next/image";
import { Bell, Menu } from "lucide-react";
import Link from "next/link";

interface DashboardNavbarProps {
  onMenuToggle: () => void;
}

export function DashboardNavbar({ onMenuToggle }: DashboardNavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-18 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground shadow-sm transition hover:border-border hover:text-foreground lg:hidden"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={160}
              height={40}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/about"
              className="rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              About Us
            </Link>
            <Link
              href="/contact-us"
              className="rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Contact Us
            </Link>
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                3
              </span>
            </button>
          </nav>
        </div> */}
      </div>
    </header>
  );
}
