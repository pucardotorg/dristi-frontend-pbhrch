import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface FullscreenButtonProps {
  url: string;
  iconColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  size?: number;
  className?: string;
  videoId?: string;
  imageAlt?: string;
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  url,
  iconColor = "#ffffff",
  borderColor = "transparent",
  backgroundColor = "rgba(0, 0, 0, 0.4)",
  size = 80,
  className = "",
  videoId,
  imageAlt = "Fullscreen content",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const originalVideoRef = useRef<HTMLIFrameElement | null>(null);

  // Determine content type (video or image)
  const isYouTubeVideo =
    videoId || url.includes("youtube.com") || url.includes("youtu.be");

  // Extract videoId from URL if not provided directly
  const extractedVideoId =
    videoId ||
    (() => {
      if (!url || !isYouTubeVideo) return "";
      const match = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i
      );
      return match ? match[1] : "";
    })();

  // Handle fullscreen button click
  const handleFullscreenClick = () => {
    if (isYouTubeVideo) {
      // Find the closest iframe element (the original YouTube video)
      const parentElement = document.querySelector(
        `iframe[src*="${extractedVideoId}"]`
      ) as HTMLIFrameElement | null;
      if (parentElement) {
        originalVideoRef.current = parentElement;

        // Store the original src to restore it later
        originalVideoRef.current.dataset.originalSrc =
          originalVideoRef.current.src;

        // Pause the original video by replacing the src with a paused version
        // This effectively stops the video from playing
        originalVideoRef.current.src = "about:blank";
      }
    }

    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);

    if (isYouTubeVideo) {
      // Restore the original video src after a short delay
      setTimeout(() => {
        if (
          originalVideoRef.current &&
          originalVideoRef.current.dataset.originalSrc
        ) {
          originalVideoRef.current.src =
            originalVideoRef.current.dataset.originalSrc;
        }
      }, 100);
    }
  };

  // Clean up if component unmounts while modal is open
  useEffect(() => {
    return () => {
      if (
        isModalOpen &&
        isYouTubeVideo &&
        originalVideoRef.current &&
        originalVideoRef.current.dataset.originalSrc
      ) {
        originalVideoRef.current.src =
          originalVideoRef.current.dataset.originalSrc;
      }
    };
  }, [isModalOpen, isYouTubeVideo]);
  return (
    <>
      <button
        className={`flex items-center justify-center rounded-full hover:opacity-90 transition-opacity ${className}`}
        aria-label="View fullscreen"
        onClick={handleFullscreenClick}
        style={{
          width: size,
          height: size,
          backgroundColor,
          border: `2px solid ${borderColor}`,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={size * 0.5}
          height={size * 0.5}
          fill="none"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 3H5a2 2 0 0 0-2 2v4" />
          <path d="M15 3h4a2 2 0 0 1 2 2v4" />
          <path d="M9 21H5a2 2 0 0 1-2-2v-4" />
          <path d="M15 21h4a2 2 0 0 0 2-2v-4" />
        </svg>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full">
            {isYouTubeVideo ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${extractedVideoId}?autoplay=1&rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={url}
                    alt={imageAlt}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>
            )}
            <button
              className="absolute top-4 right-4 md:top-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] md:right-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] text-white hover:text-gray-300 focus:outline-none bg-black bg-opacity-50 p-2 md:p-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] rounded-full"
              onClick={handleCloseModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 md:h-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] md:w-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FullscreenButton;
