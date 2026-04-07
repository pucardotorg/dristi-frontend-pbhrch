import React from "react";
import { Testimonial } from "../../data/testimonialData";

interface PaginationDotsProps {
  testimonials: Testimonial[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const PaginationDots: React.FC<PaginationDotsProps> = ({
  testimonials,
  activeIndex,
  setActiveIndex,
}) => {
  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      {testimonials?.map((_, index) => {
        const distance = Math.abs(activeIndex - index);
        
        let sizeClass = "w-1 h-1 opacity-0";
        if (distance === 0) {
          sizeClass = "w-4 h-4 bg-teal opacity-100";
        } else if (distance === 1) {
          sizeClass = "w-3 h-3 bg-gray-400 opacity-80";
        } else if (distance === 2) {
          sizeClass = "w-2 h-2 bg-gray-300 opacity-50";
        } else if (distance === 3) {
          sizeClass = "w-1 h-1 bg-gray-200 opacity-40"
        }

        return (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`rounded-full transition-all duration-300 ${sizeClass}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        );
      })}
    </div>
  );
};

export default PaginationDots;
