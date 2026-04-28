import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { announcementData } from "../../data/announcements";

const AnnouncementsComponent = () => {
  const [timePeriod, setTimePeriod] = useState<Date | null>(null);
  const [selectedType, setSelectedType] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = rowsPerPage;

  const filteredAnnouncements = announcementData.filter((announcement) => {
    const announcementDate = new Date(announcement.date);
    const selectedDate = timePeriod ? new Date(timePeriod) : null;

    if (selectedDate) {
      announcementDate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
    }

    const isWithinTimePeriod =
      !selectedDate || announcementDate <= selectedDate;
    const matchesType = selectedType
      ? announcement.type === selectedType
      : true;

    const matchesSearch =
      (announcement.description &&
        announcement.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (announcement.title &&
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return isWithinTimePeriod && matchesType && matchesSearch;
  });

  const indexOfLastAnnouncement = currentPage * itemsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - itemsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);

  const handleDownload = async (id: number) => {
    try {
      setDownloadingId(id);
      const response = await fetch(`/announcement/announcement-${id}.pdf`);
      if (!response.ok) throw new Error("File not found");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `announcement-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert(`Failed to download file ${error}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleClear = () => {
    setTimePeriod(null);
    setSelectedType("");
    setSearchQuery(""); // Reset search query on clear
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-3xl">Announcements</h2>
      </div>
      {currentAnnouncements.length === 0 ? (
        <p>No announcements</p>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full py-2 pl-10 pr-4 border-b-2 border-darkGray outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Image
                  src="/images/search.svg"
                  alt="Search Icon"
                  width={16}
                  height={16}
                />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <div className="w-2/5 pr-4 relative">
                <label className="text-gray-700 font-medium text-sm">
                  Date upto which announcements are shown
                </label>
                <div className="mt-2 relative">
                  <div className="absolute left-3 top-2/3 transform -translate-y-1/2">
                    <Image
                      src="/images/search.svg"
                      alt="Search Icon"
                      width={16}
                      height={16}
                    />
                  </div>
                  <DatePicker
                    selected={timePeriod}
                    onChange={(date: Date | null) => setTimePeriod(date)}
                    className="w-full py-2 pl-10 pr-4 border-b-2 border-gray-500 outline-none bg-transparent"
                    placeholderText="All Time"
                  />
                </div>
              </div>

              <div className="w-2/5 pl-4">
                <label className="text-gray-700 font-medium text-sm">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full py-2 px-4 border-b-2 border-gray-500 outline-none bg-transparent"
                >
                  <option value="General">General</option>
                  <option value="Obituary">Obituary</option>
                </select>
              </div>

              <div className="flex items-center space-x-4 w-1/5 pl-4">
                <button
                  onClick={handleClear}
                  className="py-2 px-6 rounded-[10px] border border-gray-500 text-gray-700 bg-white"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b-2 border-darkGrey text-left bg-gray-100">
                    SI. No.
                  </th>
                  <th className="px-4 py-2 border-b-2 border-darkGrey text-left bg-gray-100 w-1/2">
                    Titles
                  </th>
                  <th className="px-4 py-2 border-b-2 border-darkGrey text-left bg-gray-100">
                    Date
                  </th>
                  <th className="px-4 py-2 border-b-2 border-darkGrey text-left bg-gray-100">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentAnnouncements.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-2 border-b border-darkGrey">{row.id}.</td>
                    <td className="px-4 py-2 border-b border-darkGrey w-1/2">
                      {row.description}
                    </td>
                    <td className="px-4 py-2 border-b border-darkGrey">
                      {row.date ? row.date : ""}
                    </td>
                    <td className="px-4 py-2 border-b border-darkGrey">
                      <button
                        onClick={() => handleDownload(row.id)}
                        className="flex items-center text-teal"
                        disabled={downloadingId === row.id}
                      >
                        <span className="mr-2">
                          {downloadingId === row.id ? "Downloading..." : "Download"}
                        </span>
                        <Image
                          src="/images/search.svg"
                          alt="Download Icon"
                          width={24}
                          height={24}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center bg-gray-100">
            <div className="flex items-center">
              <label htmlFor="rowsPerPage" className="text-teal mr-2 p-2">
                Rows per page:
              </label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="py-2 px-4 bg-transparent outline-none"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-teal"
              >
                Previous
              </button>
              <span className="text-teal">{`${currentPage} / ${totalPages}`}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-teal"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnnouncementsComponent;
