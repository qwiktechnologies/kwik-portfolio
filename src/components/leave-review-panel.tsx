import { TestimonialSubmitForm } from "./testimonial-submit-form";

export function LeaveReviewPanel({
  title = "Leave a review",
  description = "Share your experience — approved reviews appear on the homepage for other visitors to see.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-8">
      <h2 className="text-xl font-bold text-[#16181d]">{title}</h2>
      <p className="mt-2 text-sm text-[#6b7280]">{description}</p>
      <div className="mt-6">
        <TestimonialSubmitForm />
      </div>
    </div>
  );
}