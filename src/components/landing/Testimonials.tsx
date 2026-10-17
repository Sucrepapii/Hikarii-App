import React from 'react';
import { Star } from 'lucide-react';

export interface TestimonialItem {
  topic: string;
  quote: string;
  name: string;
  location: string;
  flag?: string | null;
  rating: number;
  color?: string;
  image?: string;
  initials?: string;
}

export interface TestimonialsProps {
  testimonials: TestimonialItem[];
  testimonialRef: React.RefObject<HTMLDivElement>;
  setIsHovered: (hovered: boolean) => void;
  getInitials: (name: string) => string;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials,
  testimonialRef,
  setIsHovered,
  getInitials,
}) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-16 relative z-20 w-full overflow-hidden">
      <div className="absolute inset-0 bg-[#0D0F1A] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-semibold mb-5 tracking-wide">
            Reviews
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
            Customer Testimonials
          </h2>
          <p className="text-base md:text-lg text-slate-400 mt-4">
            See how others are taking back control of their time and money.
          </p>
        </div>
      </div>

      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div
          ref={testimonialRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex overflow-x-auto gap-6 pb-6 snap-x px-6 md:px-[calc((100vw-1280px)/2)]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="min-w-[340px] md:min-w-[420px] snap-center bg-[#13151F] p-8 rounded-[1.75rem] shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-all duration-400 border border-white/[0.06] hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                    {testimonial.topic}
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="text-5xl font-serif text-primary-800/60 leading-none mb-2 select-none">
                  "
                </div>
                <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-8">
                  {testimonial.quote}
                </p>
              </div>
              <div className="pt-5 border-t border-white/[0.07] flex items-center gap-4">
                {testimonial.image ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shadow-lg group-hover:border-primary-500/50 transition-colors">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-tr ${testimonial.color || 'from-primary-500 to-amber-500'} flex items-center justify-center text-white text-xs font-black shadow-md border-2 border-white/5`}
                  >
                    {testimonial.initials || getInitials(testimonial.name)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    {testimonial.name}
                    {testimonial.flag && (
                      <span className="text-base leading-none" title={testimonial.location}>
                        {testimonial.flag}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
