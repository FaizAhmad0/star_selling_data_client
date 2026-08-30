"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";

interface DashboardNavbarProps {
  onMenuToggle: () => void;
}

export function DashboardNavbar({ onMenuToggle }: DashboardNavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-18 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="flex h-full items-center px-4 sm:px-6">
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
      </div>
    </header>
  );
}
