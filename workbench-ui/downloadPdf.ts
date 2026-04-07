import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";

interface PDFConfig {
  scale: number;
  format: string;
  quality: number;
  filename: string;
  loading: {
    text: string;
    subtext: string;
  };
}

const renderElementToImage = async (element: HTMLElement): Promise<string> => {
  try {
    console.log("Falling back to dom-to-image...");
    return await domtoimage.toPng(element);
  } catch (domError) {
    console.error("dom-to-image failed:", domError);
    throw new Error("Failed to render element to image");
  }
};

export const downloadAsPDF = async (
  pdfConfig: PDFConfig,
  modalContentRef: React.RefObject<HTMLDivElement>
) => {
  if (!modalContentRef.current) return;

  // Create loading indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.className =
    "fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-[9999]";

  try {
    // Show loading message with configurable text
    loadingDiv.innerHTML = `
        <div class="bg-white border-2 p-6 rounded-lg shadow-xl flex flex-col items-center justify-center space-y-4 animate-pulse">
          <svg class="animate-spin h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div class="text-gray-700 font-medium">${pdfConfig.loading.text}</div>
          <div class="text-gray-500 text-sm">${pdfConfig.loading.subtext}</div>
        </div>
      `;
    document.body.appendChild(loadingDiv);

    const modalContent = modalContentRef.current;

    // Save original styles to restore later
    const originalStyles = {
      width: modalContent.style.width,
      height: modalContent.style.height,
      maxHeight: modalContent.style.maxHeight,
      overflow: modalContent.style.overflow,
      position: modalContent.style.position,
      documentOverflow: document.body.style.overflow,
      padding: modalContent.style.padding,
      margin: modalContent.style.margin,
      borderRadius: modalContent.style.borderRadius,
    };

    // Store original header style
    const headerElement = modalContent.querySelector(
      'div[class*="sticky top-0"]'
    );
    const originalHeaderStyles = headerElement
      ? {
          position: (headerElement as HTMLElement).style.position,
          top: (headerElement as HTMLElement).style.top,
          zIndex: (headerElement as HTMLElement).style.zIndex,
        }
      : null;

    // Find the download button so we can hide it during PDF generation
    const downloadButton = modalContent.querySelector(
      'button[class*="bg-teal"]'
    );
    const downloadButtonVisible = downloadButton
      ? (downloadButton as HTMLElement).style.display
      : "";

    try {
      // Modify styles to capture full content
      document.body.style.overflow = "hidden";
      modalContent.style.width = "100%";
      modalContent.style.maxWidth = "1440px"; // Set maximum width for PDF
      modalContent.style.height = "auto";
      modalContent.style.maxHeight = "none";
      modalContent.style.overflow = "visible";
      modalContent.style.padding = "20px";
      modalContent.style.margin = "0 auto";
      modalContent.style.borderRadius = "0";

      // Ensure header isn't sticky for PDF generation
      if (headerElement) {
        (headerElement as HTMLElement).style.position = "relative";
        (headerElement as HTMLElement).style.top = "0";
        (headerElement as HTMLElement).style.zIndex = "1";
      }

      // Hide the download button for PDF generation
      if (downloadButton) {
        (downloadButton as HTMLElement).style.display = "none";
      }

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      modalContent.getBoundingClientRect(); // Forces reflow

      await new Promise((res) => setTimeout(res, 500)); // Allow repaint

      if (isIOS) {
        try {
          // iOS-specific solution: Capture content as image and convert to PDF
          console.log("iOS device detected, using special handling...");

          // Try to render the element to an image
          const dataUrl = await renderElementToImage(modalContent);

          console.log("Successfully rendered to image, creating PDF...");

          // Create a temporary image element to get dimensions
          const tempImg = document.createElement("img");
          tempImg.src = dataUrl;

          // Wait for image to load to get dimensions
          await new Promise((resolve) => {
            tempImg.onload = resolve;
          });

          // Create PDF with the image
          const pdf = new jsPDF({
            orientation:
              tempImg.width > tempImg.height ? "landscape" : "portrait",
            unit: "pt",
            format: pdfConfig.format,
          });

          // Calculate dimensions to fit the image properly in the PDF
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          // Calculate scaling to fit the image in the PDF page
          const imgRatio = tempImg.width / tempImg.height;
          const pdfRatio = pdfWidth / pdfHeight;

          let imgWidth, imgHeight;

          if (imgRatio > pdfRatio) {
            // Image is wider than PDF page ratio
            imgWidth = pdfWidth;
            imgHeight = pdfWidth / imgRatio;
          } else {
            // Image is taller than PDF page ratio
            imgHeight = pdfHeight;
            imgWidth = pdfHeight * imgRatio;
          }

          // Center the image on the page
          const x = (pdfWidth - imgWidth) / 2;
          const y = (pdfHeight - imgHeight) / 2;

          // Add image to PDF
          pdf.addImage({
            imageData: dataUrl,
            format: "PNG",
            x,
            y,
            width: imgWidth,
            height: imgHeight,
          });

          // Save the PDF
          pdf.save(pdfConfig.filename);

          console.log("PDF created and saved for iOS device");
        } catch (error) {
          console.error("iOS PDF generation failed:", error);
          alert("Failed to generate document for iOS. Please try again.");
        }
      } else {
        // Non-iOS devices: Use standard PDF generation
        try {
          // Capture the content with configurable scale
          const canvas = await html2canvas(modalContent, {
            scale: pdfConfig.scale,
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#ffffff",
            scrollY: 0,
            scrollX: 0,
          });

          // Create PDF with configurable format
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: pdfConfig.format,
          });

          // Calculate dimensions
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight() - 20; // Add margin to avoid cutting content at edges

          // Use the full width of the PDF page, adjusting the height to maintain aspect ratio
          const ratio = pdfWidth / canvas.width;
          const totalPdfHeight = canvas.height * ratio;
          const pageCount = Math.ceil(totalPdfHeight / pdfHeight);

          // Add each segment to its own page
          for (let i = 0; i < pageCount; i++) {
            if (i > 0) {
              pdf.addPage();
            }

            // Calculate the portion of the image to use for this page
            const sourceY = (i * pdfHeight) / ratio;
            const sourceHeight = Math.min(
              pdfHeight / ratio,
              canvas.height - sourceY
            );

            // Create a temporary canvas for this page segment
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = canvas.width;
            tempCanvas.height = sourceHeight;

            // Draw just the portion needed for this page
            const ctx = tempCanvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(
                canvas,
                0, // sx
                sourceY, // sy
                canvas.width, // sWidth
                sourceHeight, // sHeight
                0, // dx
                0, // dy
                tempCanvas.width, // dWidth
                tempCanvas.height // dHeight
              );

              // Add to PDF with configurable quality
              pdf.addImage({
                imageData: tempCanvas.toDataURL(
                  "image/jpeg",
                  pdfConfig.quality
                ),
                format: "JPEG",
                x: 0,
                y: 0,
                width: pdfWidth,
                height: sourceHeight * ratio,
                compression: "FAST",
              });
            }
          }

          // Save with configurable filename
          pdf.save(pdfConfig.filename);
        } catch (error) {
          console.error("PDF generation failed:", error);
          alert("Failed to generate PDF. Please try again.");
        }
      }
    } finally {
      // Always restore original styles
      modalContent.style.width = originalStyles.width;
      modalContent.style.height = originalStyles.height;
      modalContent.style.maxHeight = originalStyles.maxHeight;
      modalContent.style.overflow = originalStyles.overflow;
      modalContent.style.position = originalStyles.position;
      modalContent.style.padding = originalStyles.padding;
      modalContent.style.margin = originalStyles.margin;
      modalContent.style.borderRadius = originalStyles.borderRadius;
      document.body.style.overflow = originalStyles.documentOverflow;

      // Restore header styles
      if (headerElement && originalHeaderStyles) {
        (headerElement as HTMLElement).style.position =
          originalHeaderStyles.position;
        (headerElement as HTMLElement).style.top = originalHeaderStyles.top;
        (headerElement as HTMLElement).style.zIndex =
          originalHeaderStyles.zIndex;
      }

      // Restore the download button visibility
      if (downloadButton) {
        (downloadButton as HTMLElement).style.display = downloadButtonVisible;
      }
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    // Always remove loading indicator
    if (document.body.contains(loadingDiv)) {
      document.body.removeChild(loadingDiv);
    }
  }
};
