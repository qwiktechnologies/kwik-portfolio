import { PortfolioForm } from "@/components/portfolio-form";
import { requireStudio } from "@/lib/access";

export default async function NewPortfolioPage() {
  await requireStudio();
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-5xl">New format</h1>
      <p className="mt-2 mb-6 text-sm text-muted">Add a cover that shows the trade, a naira price, and a scope a customer can read before they pay.</p>
      <PortfolioForm />
    </div>
  );
}
