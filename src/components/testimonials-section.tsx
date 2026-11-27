import { featuredTestimonials } from "@/lib/testimonials";
import { TestimonialsCarousel } from "./testimonials-carousel";

export function TestimonialsSection() {
  return (
    <section className="bg-[#f7f6f3] py-16 sm:py-20" aria-labelledby="testimonials-heading">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <h2 id="testimonials-heading" className="text-center font-serif text-4xl font-bold text-[#16181d] sm:text-5xl">
          Client Testimonials
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-[#5e584e]">
          Stories from businesses we have worked with. After you buy a format, you can leave a review from the work page or your payment confirmation.
        </p>
        <TestimonialsCarousel items={featuredTestimonials} />
      </div>
    </section>
  );
}