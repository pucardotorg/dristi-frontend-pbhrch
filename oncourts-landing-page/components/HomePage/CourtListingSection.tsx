import React, { useRef, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { svgIcons } from "../../data/svgIcons";
import styles from "../../styles/WhatsNewCard.module.css";
import { CauseListItem } from "./NoticeAndCauseListSection";
import PDFViewer from "../Utils/PDFViewer";

interface NoticeItem {
  id: string;
  title: string;
  date: Date;
  description: string;
  fileUrl: string;
  isPriority?: boolean;
}

interface CourtListingSectionProps {
  CauseListItem: CauseListItem[];
  noticeItems: NoticeItem[];
}

type DocViewerDocument = {
  uri: string;
  fileType: string;
  fileName?: string;
};

const CourtListingSection: React.FC<CourtListingSectionProps> = ({
  CauseListItem,
  noticeItems,
}) => {
  const tenantId = localStorage.getItem("tenant-id") || "kl";
  const [searchDate, setSearchDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<DocViewerDocument[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [causeListItemState, setCauseListItemState] = useState<CauseListItem>();
  const [loading, setLoading] = useState(false);

  const maxNoticePages = Math.ceil(noticeItems.length / itemsPerPage);
  const displayedNotices = noticeItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatDate = (date: Date): string => {
    return format(date, "dd MMM yyyy");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setSearchDate(selectedDate);

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = new Date(selectedDate).toLocaleDateString(
      "en-IN",
      options,
    );

    const title = `${formattedDate} Causelist - 24x7 ON Court`;
    setCauseListItemState({
      id: "1",
      title,
      date: new Date(selectedDate),
      fileStoreId: "",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreview = async (date: string) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("/api/_download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId: tenantId,
          Criteria: {
            courtId: "KLKM52",
            searchDate: date,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);

      // 1️⃣ Show preview using DocViewer
      setDocuments([
        {
          uri: fileURL,
          fileType: "pdf",
          fileName: `CauseList-${date}.pdf`,
        },
      ]);
      setPreviewMode(true);

      // Optional: auto-download after preview (if needed)
      // const link = document.createElement("a");
      // link.href = fileURL;
      // link.download = `causelist-${date}.pdf`;
      // link.click();
    } catch (error) {
      console.log("Download failed:", (error as Error).message);
      alert(
        `Failed to download: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex space-x-8 p-8 w-[95%]">
        <div className="w-[48%] space-y-4">
          <div>
            <div className="flex items-center mb-6 text-xl">
              <div className="bg-teal text-white px-3 py-1 shadow-md shadow-gray-400 font-raleway ">
                <span className="font-medium">Cause</span>
              </div>
              <div className="ml-2 font-medium">List</div>
            </div>
            <p className="text-gray-700 mb-6 font-raleway text-lg font-normal">
              Cause list for the next day will be available on the website after
              5 PM.
            </p>
          </div>

          <div className="mb-6 pt-4">
            <label className="block mb-2 text-gray-700 font-raleway font-medium">
              Search by Date
            </label>
            <div className="relative w-[90%] border-b border-gray-300 flex items-center">
              <input
                ref={dateInputRef}
                type="date"
                value={searchDate}
                onChange={handleDateChange}
                onClick={() => {
                  dateInputRef.current?.showPicker?.();
                }}
                className={`${styles.customDateInput} w-full py-2 pr-16 text-gray-700 focus:outline-none appearance-none`}
              />

              {/* Calendar Icon */}
              <div
                className=" text-teal cursor-pointer"
                onClick={() => {
                  if (dateInputRef.current) {
                    dateInputRef.current.showPicker?.();
                    dateInputRef.current.focus();
                  }
                }}
                title="Pick Date"
              >
                <svgIcons.CalanderIcon />
              </div>

              {/* Clear Button */}
              <button
                className="bg-teal text-white mx-2 px-1 py-1 rounded flex items-center  justify-center cursor-pointer"
                onClick={() => {
                  setCauseListItemState(undefined);
                  setSearchDate("");
                }}
                disabled={!searchDate}
                title="Clear Date"
              >
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 relative w-[90%] pt-4">
            {!searchDate ? (
              CauseListItem?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border rounded p-4"
                >
                  <div className="flex items-center font-raleway text-lg">
                    <div className="text-gray-700 hover:text-teal-600 font-semibold underline">
                      {item.fileStoreId
                        ? item.title
                        : `No hearings are scheduled for ${format(item.date, "dd MMM yyyy")}`}
                    </div>
                  </div>
                  {item.fileStoreId && (
                    <div
                      onClick={() =>
                        handlePreview(format(item.date, "yyyy-MM-dd"))
                      } // assuming item.date exists
                      className="bg-teal text-white px-3 py-2 rounded flex items-center text-sm underline w-[125px] justify-center cursor-pointer"
                    >
                      <span>View List</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex justify-between items-center border rounded p-4">
                <div className="flex items-center font-raleway text-lg">
                  <div className="text-gray-700 hover:text-teal-600 font-semibold underline">
                    {causeListItemState?.title}
                  </div>
                </div>
                <div
                  onClick={() => handlePreview(searchDate)}
                  className="bg-teal text-white px-3 py-2 rounded flex items-center text-sm underline w-[125px] justify-center cursor-pointer"
                >
                  <span>View List</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-[2px] bg-gray-300"></div>

        <div className="w-[48%] mb-2 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center mb-6 text-xl">
              <div className="bg-teal text-white px-3 py-1 shadow-md shadow-gray-400 font-raleway">
                <span className="font-medium">Notice</span>
              </div>
              <div className="ml-2 font-medium">Board</div>
            </div>
            <div className="bg-white border border-teal px-8 py-2 rounded-md">
              <Link href="/notice-board" className="text-teal font-semibold">
                View All
              </Link>
            </div>
          </div>

          <div className="flex-1">
            {displayedNotices.length === 0 ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-500 text-center text-2xl font-semibold px-4">
                  No official notices are available now.
                  <br />
                  Please revisit this section for future updates and
                  announcements.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {displayedNotices.map((notice) => (
                  <div key={notice.id} className="pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="w-4 h-4 flex items-center me-1">
                          <svgIcons.CalanderIcon />
                        </div>
                        <span className="text-gray-500 text-sm">
                          Date: {formatDate(notice.date)}
                        </span>
                      </div>
                      <a
                        href={notice.fileUrl}
                        className="text-grey-600 hover:underline flex items-center text-sm"
                        download
                      >
                        <span className="underline">Download</span>
                        <svgIcons.DownloadIcon />
                      </a>
                    </div>

                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {notice.title}
                    </h3>
                    <p className="text-gray-600 text-md">
                      {notice.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {displayedNotices.length > 0 && (
            <div className="flex justify-center mt-auto pt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded mr-2 text-gray-600 disabled:opacity-50"
              >
                ← Prev
              </button>

              {Array.from({ length: maxNoticePages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded mx-1 ${
                      page === currentPage
                        ? "bg-teal text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === maxNoticePages}
                className="px-3 py-1 border rounded ml-2 text-gray-600 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-60 flex items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-teal-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        </div>
      ) : (
        previewMode && (
          <PDFViewer
            previewMode={previewMode}
            documents={documents}
            setPreviewMode={setPreviewMode}
          />
        )
      )}
    </div>
  );
};

export default CourtListingSection;
