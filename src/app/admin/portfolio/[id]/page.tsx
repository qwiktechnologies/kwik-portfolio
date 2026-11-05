import { notFound } from "next/navigation";
import { PortfolioForm } from "@/components/portfolio-form";
import { requireStudio } from "@/lib/access";
import { prisma } from "@/lib/db";
import { parseGallery } from "@/lib/site";

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStudio();
  const { id } = await params;
  const item = await prisma.portfolioItem.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-5xl">Edit {item.title}</h1>
      <div className="mt-6">
        <PortfolioForm item={{ ...item, gallery: parseGallery(item.gallery).join("\n") }} />
      </div>
    </div>
  );
}
