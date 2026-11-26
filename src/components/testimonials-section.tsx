import { featuredTestimonials } from "@/lib/testimonials";
import { TestimonialSubmitForm } from "./testimonial-submit-form";

export function TestimonialsSection() {
  return (
    <section className="bg-[#f7f6f3] py-16 sm:py-20" aria-labelledby="testimonials-heading">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <h2 id="testimonials-heading" className="text-center font-serif text-4xl font-bold text-[#16181d] sm:text-5xl">
          Client Testimonials
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-[#5e584e]">
          Stories from businesses we have worked with. Share yours below — we review submissions before they appear here.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {featuredTestimonials.map((item) => (
            <figure
              key={item.name}
              className="flex h-full flex-col rounded-2xl border border-[#e3daca] bg-white p-6 shadow-sm sm:p-8"
            >
              <blockquote className="flex-1 text-lg font-semibold leading-8 text-[#16181d] sm:text-xl">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-[#ece8df] pt-4">
                <p className="text-base font-bold text-[#1d4e9e]">{item.name}</p>
                <p className="text-sm text-[#5e584e]">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mx-auto mt-14 max-w-xl">
          <h3 className="text-center text-lg font-bold text-[#16181d]">Share your experience</h3>
          <p className="mt-2 text-center text-sm text-[#5e584e]">
            Upload a short testimonial and optional photo. Our team will approve it for the site.
          </p>
          <div className="mt-6 rounded-2xl border border-[#e3daca] bg-white p-5 sm:p-6">
            <TestimonialSubmitForm />
          </div>
        </div>
      </div>
    </section>
  );
}