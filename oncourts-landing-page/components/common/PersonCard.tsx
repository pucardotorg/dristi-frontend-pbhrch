import React, { useEffect, useState } from "react";
import Image from "next/image";

interface PersonCardProps {
  t: (key: string) => string;
  imagePath: string;
  name: string;
  title: string;
  description?: string;
  className?: string;
  cardHeight?: number;
  setMaxHeight?: (height: number) => void;
  animateOnHover?: boolean;
}

const PersonCard: React.FC<PersonCardProps> = ({
  t,
  imagePath,
  name,
  title,
  description,
  className = "",
  cardHeight,
  setMaxHeight,
  animateOnHover = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const textRef = React.useRef<HTMLDivElement>(null);

  // Report this card's height to parent for uniform sizing
  useEffect(() => {
    if (textRef.current && setMaxHeight) {
      const height = textRef.current.scrollHeight;
      setMaxHeight(height);
    }
  }, [name, title, setMaxHeight]);

  return (
    <div
      className={`flex flex-col ${className} w-full max-w-[350px]`}
      onMouseEnter={() => animateOnHover && setIsHovered(true)}
      onMouseLeave={() => animateOnHover && setIsHovered(false)}
    >
      <div
        className={`
        w-full bg-white border border-[#CBD5E1] rounded-md overflow-hidden shadow-sm flex flex-col
        ${animateOnHover ? "transition-all duration-300 ease-in-out" : ""}
        ${isHovered ? "shadow-lg transform scale-105" : ""}
      `}
      >
        {/* Image container - fixed aspect ratio and dimensions */}
        <div className="relative w-full aspect-[3.5/4.5] border-b border-[#CBD5E1]">
          {imagePath ? (
            <Image
              src={imagePath}
              alt={name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center border-b border-[#CBD5E1]">
              <div>
                <Image
                  src="/images/singlePerson.png"
                  alt={name}
                  width={100}
                  height={100}
                  priority
                />
              </div>
            </div>
          )}

          {/* Overlay with description on hover */}
          {animateOnHover && description && (
            <div
              className={`
              absolute inset-0 bg-[#0F766E]/90 flex items-center justify-center p-4 overflow-y-auto
              transition-opacity duration-300 ease-in-out
              ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
            >
              <p className="text-white text-sm md:text-[clamp(12.88px,calc(12.88px+((18-12.88)*((100vw-1200px)/662))),18px)] font-roboto text-center">
                {t(description)}
              </p>
            </div>
          )}
        </div>

        {/* Text container with fixed height based on the tallest card */}
        <div
          ref={textRef}
          className="py-3 md:py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-2 md:px-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] flex flex-col justify-center items-center overflow-auto"
          style={{ height: cardHeight ? `${cardHeight}px` : "auto" }}
        >
          <h3
            className={`
            text-base md:text-[clamp(16.75px,calc(16.75px+((24-16.75)*((100vw-1200px)/662))),24px)] font-medium font-libre w-full text-center break-words
            ${isHovered ? "text-[#0F766E]" : "text-[#0F766E]"}
            transition-colors duration-300
          `}
          >
            {name}
          </h3>
          <p className="text-sm md:text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] font-roboto text-[#3A3A3A] text-center w-full break-words">
            {t(title)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
