import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DIAGRAMS = [
  { href: "/diagrams/oil-pan", title: "Cover, Rear Plate & Oil Pan", desc: "Oil pan, drain plug, strainer, rear plate", ready: true },
  { href: "#", title: "Power Steering Oil Line", desc: "Pressure & return hoses", ready: false },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight">LancerParts</h1>
      <p className="mt-1 text-muted-foreground">Mitsubishi Lancer CK2A · 4G15 1.5L — tap a diagram to find parts.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {DIAGRAMS.map((d) =>
          d.ready ? (
            <Link key={d.title} href={d.href} className="rounded-xl focus-visible:outline-2">
              <Card className="h-full transition-colors hover:bg-muted">
                <CardHeader>
                  <CardTitle>{d.title}</CardTitle>
                  <CardDescription>{d.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ) : (
            <Card key={d.title} className="h-full opacity-60">
              <CardHeader>
                <CardTitle>{d.title}</CardTitle>
                <CardDescription>{d.desc} · coming soon</CardDescription>
              </CardHeader>
            </Card>
          ),
        )}
      </div>
    </main>
  );
}
