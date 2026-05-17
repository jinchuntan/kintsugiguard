import type { ReactNode } from "react";

interface PageFrameProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function PageFrame({ eyebrow, title, description, children }: PageFrameProps) {
  return (
    <section className="dashboard-grid min-h-dvh py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase text-gold-700">{eyebrow}</p>
          <h1 className="break-anywhere mt-2 text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
          <p className="mt-3 text-base leading-7 text-graphite">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
