import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { CloudDownload, X, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


const PDFViewer = ({ documents, previewMode, setPreviewMode }) => {
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const file = documents[0]?.uri;
  const fileName = documents[0]?.fileName || 'Document';

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return previewMode && documents.length > 0 ? (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-[70vw] h-[80vh] relative flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-100 shadow-sm">
          <div className="text-sm text-gray-800 font-medium truncate">{fileName}</div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
              className="text-gray-600 hover:text-blue-600 transition"
              title="Zoom Out"
            >
              <ZoomOut />
            </button>
            <span className="text-gray-800 text-sm">{(zoom * 100).toFixed(0)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
              className="text-gray-600 hover:text-blue-600 transition"
              title="Zoom In"
            >
              <ZoomIn />
            </button>
            <button
              onClick={handleDownload}
              className="text-green-600 hover:text-green-700 transition flex items-center gap-1 font-medium text-sm"
              title="Download PDF"
            >
              <CloudDownload className="w-4 h-4" />
              <span>Download</span>
            </button>

            <button
              onClick={() => setPreviewMode(false)}
              className="text-gray-500 hover:text-red-500 transition-colors duration-200 text-2xl font-bold"
              aria-label="Close preview"
            >
              <X />
            </button>
          </div>
        </div>

        {/* Scrollable Viewer */}
        <div ref={containerRef} className="flex-1 overflow-y-auto p-4 bg-[#fafafa]">
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<p className="text-center text-gray-600">Loading PDF...</p>}
            error={<p className="text-red-500 text-center">Failed to load PDF.</p>}
          >
            {Array.from({ length: numPages }, (_, index) => (
              <div
                key={index}
                className="mb-4 flex justify-center"
              >
                <Page
                  pageNumber={index + 1}
                  scale={zoom}
                  width={containerWidth ? containerWidth - 64 : undefined} // adjust to padding
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </div>
            ))}
          </Document>
        </div>
      </div>
    </div>
  ) : null;
};

export default PDFViewer;