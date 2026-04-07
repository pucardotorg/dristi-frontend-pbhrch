import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { handleAuthError } from "../../libraries/utils/authUtils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocViewWrapperProps {
  fileStoreId?: string;
  tenantId?: string;
  authToken?: string;
  blob?: Blob;
  isView?: boolean;
}

const DocViewWrapper: React.FC<DocViewWrapperProps> = ({
  fileStoreId,
  tenantId,
  authToken,
  blob,
  isView = false,
}) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let objectUrl: string | null = null;
    let mounted = true;
    const controller = new AbortController();

    const fetchDoc = async () => {
      if (!fileStoreId) return;
      setIsLoading(true);
      setError(null);
      try {
        const uri = `/api/getFileByFileStoreId?tenantId=${tenantId}&fileStoreId=${fileStoreId}`;
        const headers: HeadersInit = authToken
          ? { "auth-token": authToken }
          : {};
        const response = await fetch(uri, {
          method: "GET",
          headers,
          signal: controller.signal,
        });
        if (response.status === 200) {
          const contentType = response.headers.get("content-type");
          const fetched = await response.blob();
          if (mounted) {
            const resolvedType = fetched.type || contentType || "";
            setIsImage(resolvedType.startsWith("image/"));
            objectUrl = URL.createObjectURL(fetched);
            setFileUrl(objectUrl);
          }
        } else {
          if (handleAuthError(response)) return;
          setError(`HTTP Error: ${response.status}`);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // Silent for intentional aborts
          return;
        }
        console.error("DocViewWrapper fetch error:", err);
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch document",
          );
        }
      } finally {
        if (mounted && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    if (blob) {
      setError(null);
      setIsImage(blob.type.startsWith("image/"));
      objectUrl = URL.createObjectURL(blob);
      setFileUrl(objectUrl);
    } else {
      fetchDoc();
    }

    return () => {
      mounted = false;
      controller?.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileStoreId, tenantId, authToken, blob, reloadKey]);
  // Track container width correctly, accommodating modal animations
  useEffect(() => {
    let mounted = true;

    const updateWidth = () => {
      if (!mounted) return;
      if (containerRef.current) {
        // Subtract a tiny margin to prevent horizontal scrollbars
        setContainerWidth(Math.floor(containerRef.current.clientWidth - 4));
      }
    };

    // Calculate immediately
    updateWidth();

    // Re-calculate at various intervals while modal animations finish
    const t1 = setTimeout(updateWidth, 100);
    const t2 = setTimeout(updateWidth, 300);
    const t3 = setTimeout(updateWidth, 600);

    // Watch for window resizes
    window.addEventListener("resize", updateWidth);

    return () => {
      mounted = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full min-h-[500px] gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full min-h-[500px] gap-4 bg-gray-50 border border-red-100 rounded-lg p-6">
        <div className="text-red-500 font-medium text-center">{error}</div>
        <button
          onClick={() => setReloadKey((prev) => prev + 1)}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-semibold"
        >
          Reload Document
        </button>
      </div>
    );
  }

  if (!fileUrl) return null;

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-x-hidden flex flex-col items-center bg-gray-50 ${!isView && "h-full overflow-y-auto hide-scrollbar"}`}
    >
      {isImage ? (
        <div className="flex justify-center items-center w-full h-full min-h-[500px] p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fileUrl}
            alt="Document Preview"
            className="max-w-full max-h-full object-contain shadow-sm bg-white"
          />
        </div>
      ) : (
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          className="flex flex-col items-center w-full"
          loading={
            <div className="flex justify-center items-center w-full h-[500px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          }
          error={
            <div className="flex justify-center items-center w-full h-[500px] text-red-500">
              Failed to load PDF.
            </div>
          }
        >
          {Array.from({ length: numPages }, (_, index) => (
            <div
              key={index}
              className="mb-4 shadow-sm bg-white flex justify-center max-w-full"
            >
              <Page
                pageNumber={index + 1}
                width={containerWidth}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="max-w-full"
              />
            </div>
          ))}
        </Document>
      )}
    </div>
  );
};

export default DocViewWrapper;
