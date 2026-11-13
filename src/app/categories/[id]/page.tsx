import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryExplorer } from "@/components/catalog/category-explorer";
import { CATEGORIES, getCategory } from "@/data/catalog";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).id);
  return { title: category ? `${category.name} · LancerParts` : "LancerParts" };
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).id);
  if (!category) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
      <nav className="mb-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">Categories</Link> / {category.name}
      </nav>
      <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">{category.name}</h1>
      <CategoryExplorer category={category} />
    </main>
  );
}
