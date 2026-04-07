import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  /**
   * Current start index (1-based for display)
   */
  currentStartIndex: number;

  /**
   * Total number of items across all pages
   */
  totalItems: number;

  /**
   * Number of items per page
   */
  itemsPerPage: number;

  /**
   * Handler for going to previous page
   */
  onPrevPage: () => void;

  /**
   * Handler for going to next page
   */
  onNextPage: () => void;

  /**
   * Whether we're at the first page (to disable prev button)
   */
  isFirstPage: boolean;

  /**
   * Whether we're at the last page (to disable next button)
   */
  isLastPage: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentStartIndex,
  totalItems,
  itemsPerPage,
  onPrevPage,
  onNextPage,
  isFirstPage,
  isLastPage,
}) => {
  return (
    <div className="flex items-center justify-end mt-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={onPrevPage}
          disabled={isFirstPage}
          className={`flex items-center justify-center w-8 h-8 rounded border border-[#CBD5E1] bg-[#F8FAFC] ${
            isFirstPage
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiChevronLeft size={18} />
        </button>

        <div className="font-roboto font-medium text-base text-gray-700">
          {currentStartIndex}-
          {Math.min(currentStartIndex + itemsPerPage - 1, totalItems)} of{" "}
          {totalItems}
        </div>

        <button
          onClick={onNextPage}
          disabled={isLastPage}
          className={`flex items-center font-[Inter] justify-center w-8 h-8 rounded border border-[#CBD5E1] bg-[#F8FAFC] ${
            isLastPage
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
