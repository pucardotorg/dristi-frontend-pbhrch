import React, { useState, useEffect } from "react";
import { testimonialData, Testimonial } from "../../data/testimonialData";
import Image from "next/image";
import PaginationDots from "./PaginationDots";

const TestimonialCarousel: React.FC = () => {
  const { title, description, testimonials } = testimonialData ?? {};
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(
        (prevIndex) => (prevIndex + 1) % (testimonials?.length ?? 1)
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials?.length]);

  return (
    <div className="bg-tealBg py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-teal mb-4">
            {title || ""}
          </h2>
          <p className="text-gray-600 max-w-4xl mx-auto text-lg">
            {description || ""}
          </p>
        </div>

        <div className="relative overflow-visible">
          <div
            className="flex transition-transform duration-[1500ms] ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials?.map((testimonial: Testimonial, index: number) => (
              <div
                key={index}
                className={`min-w-full transition-opacity duration-[1500ms] ease-out flex justify-center items-center px-2 ${index === activeIndex ? "opacity-100" : "opacity-60 blur-sm"
                  }`}
              >
                <div className="bg-white rounded-[40px] shadow-lg p-3 md:p-6 border-2 border-teal w-full max-w-[900px] h-[320px] mx-auto flex flex-col justify-center items-center text-center">
                  <div className="relative w-24 h-[8rem]">
                    <Image
                      src={testimonial?.image}
                      alt={testimonial?.name}
                      className="rounded-full object-cover"
                      fill
                      sizes="(max-width: 768px) 108px, 108px"
                    />
                  </div>
                  <p className="text-teal text-center font-medium mb-4 mt-4 text-base md:text-lg max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
                    {testimonial?.content || ""}
                  </p>
                  <div className="mt-auto">
                    <p className="font-medium text-teal text-2xl">
                      {testimonial?.name || ""}
                      <span className="text-sm md:text-base font-normal text-teal ml-1">
                        - {testimonial?.role || ""}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <PaginationDots
          testimonials={testimonials}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </div>
    </div>
  );
};

export default TestimonialCarousel;
