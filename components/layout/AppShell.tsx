import type { ReactNode } from "react";
import { AppNav } from "@/components/layout/AppNav";
import { GuideAssistant } from "@/components/layout/GuideAssistant";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppNav />
      <main>{children}</main>
      <GuideAssistant />
    </div>
  );
}
