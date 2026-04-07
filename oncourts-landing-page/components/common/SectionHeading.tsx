import React from "react";

interface SectionHeadingProps {
  title: string;
  fontSize?: string | number;
  showBorder?: boolean;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  fontSize = "text-5xl",
  showBorder = true,
  className = "",
}) => {
  // Tailwind token → px map (defaults from Tailwind)
  const fontPxMap: Record<string, number> = {
    "text-6xl": 60,
    "text-5xl": 48,
    "text-4xl": 36,
    "text-3xl": 30,
    "text-2xl": 24,
    "text-xl": 20,
    "text-lg": 18,
    "text-base": 16,
  };

  // Normalize any incoming fontSize to a px number
  const toPx = (value: string | number): number => {
    if (typeof value === "number") return value;

    const str = value.trim();

    // 1) direct tailwind token - exact match e.g. "text-5xl"
    if (fontPxMap[str]) return fontPxMap[str];

    // 2) Tailwind arbitrary token: text-[4rem], text-[36px], text-[2.5rem]
    //    extract the inner value between brackets
    const arbitraryMatch = str.match(/^text-\[(.+)\]$/);
    const inner = arbitraryMatch ? arbitraryMatch[1].trim() : null;

    const candidate = inner ?? str; // use inner if it exists, else the original string

    // 3) px string like "48px"
    if (/^\d+(\.\d+)?px$/.test(candidate)) {
      return parseFloat(candidate);
    }

    // 4) rem string like "3rem"
    if (/^\d+(\.\d+)?rem$/.test(candidate)) {
      const remVal = parseFloat(candidate);
      return remVal * 16; // default root font-size = 16px
    }

    // 5) plain number string "48" or "48.0"
    if (/^\d+(\.\d+)?$/.test(candidate)) {
      return parseFloat(candidate);
    }

    // 6) If nothing matched, fallback to text-5xl (48px)
    return 48;
  };

  const maxPx = toPx(fontSize as string | number);
  const minPx = parseFloat(((maxPx * 1200) / 1862).toFixed(2));
  const slope = 1862 - 1200; // 662

  // sensible line-height: 1 for large headings, slightly larger for small
  const lineHeight =
    fontSize === "text-5xl" ? 1 : fontSize === "text-[40px]" ? "2rem" : "1.5";

  return (
    <div
      className={`font-medium text-center mb-8 font-libre text-[#3A3A3A] ${className}`}
      style={{
        fontSize: `clamp(${minPx}px, calc(${minPx}px + (${maxPx - minPx}) * ((100vw - 1200px) / ${slope})), ${maxPx}px)`,
        lineHeight,
        WebkitTextStrokeWidth: "0.5px",
      }}
    >
      <span className="inline-block pb-3">{title}</span>
      {showBorder && (
        <div className="border-b border-[#CBD5E1] w-full md:w-[40%] mx-auto mt-1"></div>
      )}
    </div>
  );
};

export default SectionHeading;
