import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioSection, sectionInfo } from "@/components/sections";

export function generateStaticParams() {
  return Object.keys(sectionInfo).map((section) => ({ section }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const info = Object.hasOwn(sectionInfo, section)
    ? sectionInfo[section]
    : null;
  return info
    ? {
        title: info.eyebrow.split(" / ").at(-1),
        description: info.description,
        alternates: { canonical: `/${section}` },
      }
    : { title: "Outside the map" };
}
export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!Object.hasOwn(sectionInfo, section)) notFound();
  return <PortfolioSection section={section} />;
}
