import React, { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { commonStyles } from "../../styles/commonStyles";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import SectionHeading from "../../components/common/SectionHeading";
import { FiDownload, FiSearch, FiRefreshCw } from "react-icons/fi";
import Pagination from "../../components/Utils/Pagination";
import { useMediaQuery } from "@mui/material";
import { formatDate } from "../../utils/formatDate";

// Define the Notice type
interface Notice {
  title?: string;
  publishedDate?: string;
  fileStoreId?: string;
  tenantId?: string;
  type?: string;
  language?: string;
  validTill?: string;
  noticeNumber?: string;
  createdBy?: string;
  createdTime?: string;
  lastModifiedBy?: string;
  lastModifiedTime?: string;
}

const Notices: React.FC = () => {
  const { t } = useSafeTranslation();
  const initialLoadRef = useRef<boolean>(false);
  const [offset, setOffset] = useState(0);
  const limit = 50;
  const [totalCount, setTotalCount] = useState(0);
  const [noticesList, setNoticesList] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const tenantId = localStorage.getItem("tenant-id");
  const [searchText, setSearchText] = useState("");
  const isMobile = useMediaQuery("(max-width:640px)");

  const searchNotices = useCallback(
    async (offsetOverride: number, searchTextOverride: string) => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/search-notices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            searchText: searchTextOverride,
            limit,
            offset: offsetOverride,
            tenantId,
          }),
        });

        const data = await response.json();

        if (data && data.LandingPageNotices) {
          setNoticesList(data.LandingPageNotices);
          setTotalCount(data.totalCount || data.LandingPageNotices.length);
        } else {
          setNoticesList([]);
          setTotalCount(0);
        }
      } catch (error) {
        console.error("Error searching notices:", error);
        setNoticesList([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [limit, tenantId]
  );

  // Pagination handlers
  const handleNextPage = () => {
    if (offset + limit < totalCount) {
      setOffset(offset + limit);
      searchNotices(offset + limit, searchText);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 200);
    }
  };

  const handlePrevPage = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
      searchNotices(offset - limit, searchText);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 200);
    }
  };

  const handleSearch = () => {
    setOffset(0);
    searchNotices(0, searchText);
  };

  const handleReset = () => {
    setSearchText("");
    setOffset(0);
    searchNotices(0, "");
  };

  useEffect(() => {
    // Only run initialization once
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      searchNotices(0, "");
    }
  }, [searchNotices]);

  const fetchFile = async (fileStoreId?: string): Promise<Blob | null> => {
    if (!fileStoreId) {
      console.error("File Store ID is required");
      return null;
    }

    try {
      // Direct API call to get the file
      const response = await fetch(`/api/downloadNotice`, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId,
          fileStoreId,
          moduleName: "landing-page",
        }),
      });

      if (!response.ok) {
        throw new Error(`File download failed with status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error("Error fetching file:", error);
      return null;
    }
  };

  const openFileInNewTab = async (
    fileStoreId?: string,
    title?: string
  ): Promise<void> => {
    const blob = await fetchFile(fileStoreId);
    if (!blob) return;
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);

    if (isIOS) {
      // For iOS, create a temporary anchor element and trigger a download
      // Get filename from content-disposition header or create a default one
      const fileName = `${title}.pdf`;

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);

      // Create a download URL and set attributes
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;

      // Programmatically click the link to trigger download
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } else {
      // For other devices, use the standard window.open method
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 5000);
    }
  };

  const downloadFile = async (
    fileStoreId?: string,
    fileName?: string
  ): Promise<void> => {
    const blob = await fetchFile(fileStoreId);
    if (!blob) return;

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || `notice-${fileStoreId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 5000);
  };

  return (
    <div className="max-w-screen min-h-screen mx-auto py-4 px-4 md:py-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] md:px-[clamp(51.9px,calc(51.9px+((80-51.9)*((100vw-1200px)/662))),80px)] bg-white">
      <Head>
        <title>{t("NOTICES")}</title>
      </Head>

      {isLoading && (
        <div className={commonStyles.loading.container}>
          <div className={commonStyles.loading.spinner}></div>
        </div>
      )}
      <div className="pt-4 md:pt-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] flex flex-col md:flex-row justify-between items-center gap-4 md:gap-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)]">
        <SectionHeading
          title={t("NOTICES")}
          className="!text-left !mb-0"
          showBorder={false}
        />
        {/* Search Bar */}
        <div className="relative text-base flex gap-2 md:gap-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)]">
          <input
            type="text"
            placeholder={t("SEARCH")}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="md:pl-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] pl-4 pr-4 py-1 font-roboto text-lg md:text-[clamp(13.54px,calc(13.54px+((18-13.54)*((100vw-1200px)/662))),18px)] font-medium text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          {!isMobile && (
            <FiSearch className="absolute h-5 w-5 md:h-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] md:w-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] left-3 top-1/2 transform -translate-y-1/2 text-[#334155]" />
          )}
          <button
            onClick={handleSearch}
            className={`${isMobile ? "w-10 h-10 flex items-center justify-center" : "md:px-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-1 md:text-[clamp(13.54px,calc(13.54px+((18-13.54)*((100vw-1200px)/662))),18px)]"} font-[Inter] font-medium text-[#0F766E] hover:text-green-800 bg-white rounded-lg border border-[#0F766E]`}
            aria-label={t("SEARCH")}
          >
            {isMobile ? <FiSearch className="h-5 w-5" /> : t("SEARCH")}
          </button>
          <button
            onClick={handleReset}
            className={`${isMobile ? "w-10 h-10 flex items-center justify-center" : "md:px-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-1 md:text-[clamp(13.54px,calc(13.54px+((18-13.54)*((100vw-1200px)/662))),18px)]"} font-[Inter] font-medium text-[#64748B] hover:text-green-800 bg-white rounded-lg border border-[#64748B]`}
            aria-label={t("RESET")}
          >
            {isMobile ? <FiRefreshCw className="h-5 w-5" /> : t("RESET")}
          </button>
        </div>
      </div>
      <div className="border-b border-[#CBD5E1] w-full mx-auto mb-4 mt-4 md:mt-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)]"></div>

      {/* Notices Table */}
      {!isMobile && noticesList.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-[#E2E8F0]">
          <table className="w-full">
            <thead className="text-[#0F172A] text-[22px] md:text-[clamp(16.75px,calc(16.75px+((22-16.75)*((100vw-1200px)/662))),22px)] font-semibold font-libre bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] text-left w-[10%]">
                  {t("SL_NO")}
                </th>
                <th className="py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] text-left w-[50%]">
                  {t("TITLE")}
                </th>
                <th className="py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] text-left w-[20%]">
                  {t("DATE_OF_ISSUE")}
                </th>
                <th className="py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] text-left w-[20%]">
                  {t("ACTION")}
                </th>
              </tr>
            </thead>
            <tbody className="text-[22px] md:text-[clamp(16.75px,calc(16.75px+((22-16.75)*((100vw-1200px)/662))),22px)] text-[#334155] font-roboto bg-white">
              {noticesList.map((notice, index) => (
                <tr
                  key={index}
                  className={`border-b border-[#E2E8F0] ${index % 2 === 1 ? "bg-[#F8FAFC]" : ""}`}
                >
                  <td className="py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)]">
                    {index + 1}
                  </td>
                  <td className="py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)]">
                    <a
                      href="#"
                      className="text-blue-600 hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        openFileInNewTab(notice.fileStoreId, notice.title);
                      }}
                    >
                      {notice.title}
                    </a>
                  </td>
                  <td className="py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)]">
                    {formatDate(notice.publishedDate)}
                  </td>
                  <td className="py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] text-left">
                    <button
                      className="shadow-[0_2px_10px_rgba(0,0,0,0.1)] font-[Inter] inline-flex items-center justify-center gap-2 md:py-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] py-2 md:px-[clamp(19.32px,calc(19.32px+((24-19.32)*((100vw-1200px)/662))),24px)] px-6 bg-[#F8FAFC] text-[#334155] text-[20px] md:text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] border-2 border-[#CBD5E1] rounded-xl hover:bg-gray-50 font-medium"
                      aria-label={`${t("DOWNLOAD")} ${notice.title}`}
                      onClick={() =>
                        downloadFile(notice.fileStoreId, `${notice.title}.pdf`)
                      }
                    >
                      <FiDownload size={24} /> {t("DOWNLOAD")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isMobile &&
        noticesList.length > 0 &&
        noticesList.map((notice, index) => (
          <div
            key={index}
            className="p-4 border-x-2 border-t border-b-2 border-[#E2E8F0] bg-white mb-8 rounded-lg"
          >
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 items-center">
                <div className="font-libre text-[14px] text-[#0F172A] font-semibold">
                  {t("TITLE")}:
                </div>
                <div className="text-[14px] text-[#334155]">
                  <a
                    href="#"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      openFileInNewTab(notice.fileStoreId, notice.title);
                    }}
                  >
                    {notice.title}
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="font-libre text-[14px] text-[#0F172A] font-semibold">
                  {t("DATE_OF_ISSUE")}:
                </div>
                <div className="text-[14px] text-[#334155]">
                  {formatDate(notice.publishedDate)}
                </div>
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="font-libre text-[14px] text-[#0F172A] font-semibold">
                  {t("ACTION")}:
                </div>
                <button
                  className="shadow-[0_2px_10px_rgba(0,0,0,0.1)] w-fit font-[Inter] inline-flex items-center justify-center gap-2 py-2 px-6 bg-[#F8FAFC] text-[#334155] text-[14px] border-2 border-[#CBD5E1] rounded-xl hover:bg-gray-50 font-medium"
                  aria-label={`${t("DOWNLOAD")} ${notice.title}`}
                  onClick={() =>
                    downloadFile(notice.fileStoreId, `${notice.title}.pdf`)
                  }
                >
                  <FiDownload size={15} /> {t("DOWNLOAD")}
                </button>
              </div>
            </div>
          </div>
        ))}
      {noticesList.length === 0 && (
        <div className="flex justify-center items-center p-8">
          <div className="text-xl font-roboto font-medium text-gray-500">
            {t("NO_RESULTS_FOUND")}
          </div>
        </div>
      )}
      {noticesList.length > 0 && (
        <Pagination
          currentStartIndex={offset + 1}
          totalItems={totalCount}
          itemsPerPage={limit}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          isFirstPage={offset === 0}
          isLastPage={offset + limit >= totalCount}
        />
      )}
    </div>
  );
};

export default Notices;
