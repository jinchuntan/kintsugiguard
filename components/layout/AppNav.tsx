"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  ClipboardList,
  CreditCard,
  FileText,
  Gauge,
  Shield,
  UploadCloud
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/upload", label: "Audit", icon: UploadCloud },
  { href: "/orchestration", label: "Agents", icon: Activity },
  { href: "/findings", label: "Findings", icon: BarChart3 },
  { href: "/repair-plan", label: "Repair Plan", icon: ClipboardList },
  { href: "/governance", label: "Governance", icon: Shield },
  { href: "/x402", label: "X402", icon: CreditCard },
  { href: "/impact-report", label: "Report", icon: FileText }
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-porcelain/92 shadow-line backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex w-full items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-300 sm:w-auto sm:min-w-fit">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-gold-100">
            <Gauge className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold text-ink">KintsugiGuard AI</span>
            <span className="block text-xs text-graphite">Govern agentic risk</span>
          </span>
        </Link>

        <nav className="scrollbar-thin flex w-full flex-1 items-center gap-1 overflow-x-auto rounded-md border border-ink/10 bg-white/72 p-1 sm:w-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex h-9 min-w-fit items-center gap-2 rounded-md px-3 text-sm font-medium text-graphite transition hover:bg-gold-50 hover:text-ink focus:outline-none focus:ring-2 focus:ring-gold-300",
                  active && "bg-ink text-white hover:bg-ink hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
