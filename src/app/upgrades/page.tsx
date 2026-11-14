import type { Metadata } from "next";
import Link from "next/link";
import { UpgradesExplorer } from "@/components/upgrades/upgrades-explorer";

export const metadata: Metadata = {
  title: "Upgrades · LancerParts",
  description:
    "Find body kits, turbo kits, engine, exhaust and suspension upgrades for the Lancer Evolution and Lancer.",
};

export default function UpgradesPage() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav className="mb-2 text-sm text-white/60">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          / Upgrades
        </nav>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Upgrades
        </h1>
        <p className="mt-2 max-w-2xl text-white/70">
          Pick your model and a category to see well-known upgrade kits, then
          search Shopee, Lazada, Google and eBay for parts that fit.
        </p>
        <div className="mt-8">
          <UpgradesExplorer />
        </div>
      </div>
    </main>
  );
}
