import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";

interface PdfPreviewProps {
  fileUrl: string;
  width?: number | string;
  height?: number | string;
  scale?: number;
  scrollable?: boolean;
}

const convertToPixels = (value: string, base: number): number => {
  if (value.endsWith("vw")) {
    const percent = parseFloat(value.replace("vw", ""));
    return (window.innerWidth * percent) / 100;
  } else if (value.endsWith("%")) {
    const percent = parseFloat(value.replace("%", ""));
    return (base * percent) / 100;
  }
  return parseFloat(value);
};

const PdfPreview: React.FC<PdfPreviewProps> = ({
  fileUrl,
  width = 400,
  height = 200,
  scale = 1,
  scrollable = false,
}) => {
  const [calculatedWidth, setCalculatedWidth] = useState<number>(
    typeof width === "number" ? width : 400
  );
  const [calculatedHeight, setCalculatedHeight] = useState<number>(
    typeof height === "number" ? height : 200
  );

  useEffect(() => {
    const handleResize = () => {
      const base = window.innerWidth;

      if (typeof width === "string") {
        setCalculatedWidth(convertToPixels(width, base));
      }

      if (typeof height === "string") {
        setCalculatedHeight(convertToPixels(height, window.innerHeight));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width, height]);

  return (
    <div
      className={`w-full border-[0.25px] border-[#94A3B8] rounded-[1px] ${scrollable ? "overflow-auto" : "overflow-hidden"}`}
      style={{ height: calculatedHeight }} // FIXED height
    >
      <Document file={fileUrl} loading={<div>Loading...</div>}>
        <Page
          pageNumber={1}
          width={calculatedWidth}
          scale={scale}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
};

export default PdfPreview;
