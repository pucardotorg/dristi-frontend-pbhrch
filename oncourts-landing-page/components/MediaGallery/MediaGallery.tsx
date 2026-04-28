import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { galleryImages } from "../../data/GalleryConfig";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useMediaQuery } from "@mui/material";
import { svgIcons } from "../../data/svgIcons";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

const MediaGallery: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const autoSlideTimer = useRef<NodeJS.Timeout>();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { t } = useSafeTranslation();

  const currentImage = galleryImages[currentImageIndex];

  const handlePrevious = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  }, []);

  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  }, []);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Auto-slide effect
  useEffect(() => {
    if (!isPaused) {
      autoSlideTimer.current = setInterval(handleNext, 5000);
    }
    return () => {
      if (autoSlideTimer.current) {
        clearInterval(autoSlideTimer.current);
      }
    };
  }, [handleNext, isPaused]);

  const handleTouchStart = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsPaused(false);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !isPaused) {
        if (autoSlideTimer.current) {
          clearInterval(autoSlideTimer.current);
        }
        autoSlideTimer.current = setInterval(handleNext, 5000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleNext, isPaused]);

  return (
    <section className="pt-8 md:pt-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] pb-24 md:pb-[clamp(61.89px,calc(61.89px+((96-61.89)*((100vw-1200px)/662))),96px)] bg-white">
      <div className={`w-[100vw] mx-auto px-4 ${isMobile ? "px-2" : "px-4"}`}>
        <div className="text-center mb-8">
          <h1
            className={`text-[#3A3A3A] font-libre mb-[20px] border-b border-[#CBD5E1] pb-[10px] ${
              isMobile
                ? "text-[32px] leading-[40px] mx-[50px]"
                : "text-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)] leading-[clamp(45.1px,calc(45.1px+((70-45.1)*((100vw-1200px)/662))),70px)] mx-[clamp(38.67px,calc(38.67px+((60-38.67)*((100vw-1200px)/662))),60px)]"
            }`}
          >
            {t("MEDIA_GALLERY_HEADER")}
          </h1>
          <h2
            className={` font-libre font-normal text-center text-[#3A3A3A] mb-4 px-4 ${
              isMobile
                ? "text-[24px] leading-[34px]"
                : "text-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] leading-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)]"
            }`}
          >
            {t("MEDIA_GALLERY_SUB_HEADER")}
          </h2>
          <p
            className={`font-roboto font-normal tracking-[-0.56px] text-center text-[#334155] px-4 mb-8 ${
              isMobile
                ? "text-[17px] leading-[22px]"
                : "text-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] leading-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)]"
            }`}
          >
            {t("MEDIA_GALLERY_DESCRIPTION")}
          </p>
        </div>

        {/* Main Image Display with Progress Bar */}
        <div
          className={`relative aspect-video w-full mx-auto mb-8 px-4 ${isMobile ? "h-[170px]" : "h-[70vh]"} cursor-pointer`}
        >
          {/* Progress Bar */}
          <div className="absolute bottom-5 h-2 left-8 right-8 z-10">
            <div className="flex items-center gap-2">
              {galleryImages.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full flex-1 transition-all duration-300 ${index === currentImageIndex ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          </div>

          <div
            className="relative w-full h-full"
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            onTouchStart={(e) => {
              e.preventDefault();
              handleTouchStart();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleTouchEnd();
            }}
            onTouchCancel={handleTouchEnd}
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className={`object-cover select-none pointer-events-none ${isMobile ? "" : "rounded-t-[12px]"}`}
              priority
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#00000033] hover:bg-white p-2 rounded-full shadow-lg transition-all"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-6 h-6 text-[white] hover:text-[black]" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#00000033] hover:bg-white p-2 rounded-full shadow-lg transition-all"
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-6 h-6 text-[white] hover:text-[black]" />
          </button>
          <button
            className={`absolute  z-99999 ${isMobile ? "bottom-6 right-6" : "bottom-12 right-12"}`}
            onClick={() => {
              setModalOpen(true);
            }}
          >
            <svgIcons.PreviewIcon />
          </button>
        </div>

        {/* Thumbnails Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mx-auto px-4">
          {galleryImages.map((image, index) => {
            const isFirstRow = index < 6;
            const isLastRow =
              index >= Math.floor((galleryImages.length - 1) / 6) * 6;
            const isFirstInRow = index % 6 === 0;
            const isLastInRow = (index + 1) % 6 === 0;
            const isLastPositionInLastRow =
              isLastRow && isLastInRow && (index + 1) % 6 === 0;

            let borderRadius = "";
            if (isFirstRow && isFirstInRow) borderRadius = "rounded-tl-[12px]";
            else if (isFirstRow && isLastInRow)
              borderRadius = "rounded-tr-[12px]";
            else if (isLastRow && isFirstInRow)
              borderRadius = "rounded-bl-[12px]";
            else if (isLastPositionInLastRow)
              borderRadius = "rounded-br-[12px]";

            return (
              <button
                key={image.id}
                onClick={() =>
                  handleThumbnailClick(
                    galleryImages.findIndex((img) => img.id === image.id)
                  )
                }
                className={`relative aspect-video w-full overflow-hidden transition-all ${isMobile ? "" : borderRadius} ${currentImage.id === image.id ? "ring-2 ring-[#3A3A3A]" : ""}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
          onContextMenu={(e) => e.preventDefault()}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          onTouchStart={(e) => {
            e.preventDefault();
            handleTouchStart();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleTouchEnd();
          }}
          onTouchCancel={handleTouchEnd}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] w-auto h-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2 z-[60]"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setModalOpen(false);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setModalOpen(false);
              }}
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <div className="relative w-full h-full">
              <div className="relative aspect-[16/9] w-[90vw] max-h-[90vh]">
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            {/* Navigation arrows */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-[60]"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handlePrevious();
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handlePrevious();
              }}
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-[60]"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleNext();
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleNext();
              }}
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MediaGallery;
