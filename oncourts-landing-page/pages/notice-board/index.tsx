import { useMemo, useState } from "react";
import FeaturesTable from "../../components/Utils/FeaturesTable";
import { noticeBoardData } from "../../data/noticeBoard";
import { noticeBoardConfig } from "../../data/noticeBoardConfig";
import { Calendar, ListFilter, Search } from "lucide-react";

const filterNoticeBoardData = (filters) => {
  const now = new Date();
  let startDate: Date;

  switch (filters.dateRange) {
    case "7days":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30days":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "6months":
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case "custom":
      startDate = filters.customStartDate ?? new Date(0); // default to very early if not set
      break;
    default:
      startDate = new Date(0);
  }

  let endDate = (filters.dateRange === "custom" && filters.customEndDate) ? filters.customEndDate : now;
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  return noticeBoardData?.filter((item) => {
    const itemDate = new Date(item.date);
    const isWithinRange = itemDate >= startDate && itemDate <= endDate;

    const matchesTag = filters.tag === "all" ? true : item.tag === filters.tag;
    const matchesSearch = filters.search
      ? item.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.description?.toLowerCase().includes(filters.search.toLowerCase())
      : true;

    return matchesSearch && matchesTag && isWithinRange;
  });
};

const NoticeBoard = () => {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("all");
  const [timePeriod, setTimePeriod] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [filteredData, setFilteredData] = useState(noticeBoardData);
  const [isFilterOpened, setIsFilterOpened] = useState(false);

  const isCustom = timePeriod === "custom";

  const handleClear = () => {
    setSearch("");
    setTag("all");
    setTimePeriod("all");
    setCustomStartDate("");
    setCustomEndDate("");
  };

  const handleApply = () => {
    const filtered = filterNoticeBoardData({
      dateRange: timePeriod,
      customStartDate: customStartDate,
      customEndDate: customEndDate,
      tag: tag,
      search: search,
    });
    setFilteredData(filtered);
  }

  const handleToggleFilter = () => {
    setIsFilterOpened(!isFilterOpened);
  };

  const filterCount = useMemo(() => {
    return [
      search.trim(),
      tag !== "all",
      timePeriod !== "all",
      timePeriod === "custom" && customStartDate,
      timePeriod === "custom" && customEndDate,
    ].filter(Boolean).length;
  }, [search, tag, timePeriod, customStartDate, customEndDate]);

  return (
    <div className="relative mx-auto mb-12 left-1/2 transform -translate-x-1/2 w-full max-w-[1858px] h-auto px-4 sm:px-8 gap-4 flex flex-col items-start">
      <div className="w-full flex flex-col items-center gap-4">
        <h1 className="text-[#007E7E] text-[36px] md:text-[48px] lg:text-[60px] font-bold leading-tight text-center mt-6 md:mt-12">
          {noticeBoardConfig.heading}
        </h1>
      </div>
      <div className="p-6 bg-white rounded shadow mx-auto w-full">
        {/* Search bar */}
        <div className="flex items-center gap-2 border-b pb-2 mb-4">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder={noticeBoardConfig.placeholders.search}
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Filter Icon with badge */}
          <div className="relative ml-2">
            <button onClick={handleToggleFilter} className="p-2 rounded-md bg-gray-100">
              <ListFilter />
            </button>
            {filterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filterCount}
              </span>
            )}
          </div>
        </div>

        {/* Filters Grouped */}
        {isFilterOpened && (
          <div className="flex flex-row justify-between gap-4">

            {/* Filter Controls */}
            <div className="flex flex-wrap justify-between gap-4">

              {/* Time Period */}
              <div className="w-full sm:w-[200px]">
                <label className="text-sm text-gray-500 block mb-1">
                  {noticeBoardConfig.filterLabels.timePeriod}
                </label>
                <div className="flex items-center border rounded px-2 py-1">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <select
                    className="w-full outline-none bg-transparent"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                  >
                    {noticeBoardConfig.timePeriods.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Date Range */}
              {isCustom && (
                <>
                  <div className="w-full sm:w-[200px]">
                    <label className="text-sm text-gray-500 block mb-1">
                      {noticeBoardConfig.filterLabels.startDate}
                    </label>
                    <input
                      type="date"
                      className="w-full border rounded px-2 py-1"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:w-[200px]">
                    <label className="text-sm text-gray-500 block mb-1">
                      {noticeBoardConfig.filterLabels.endDate}
                    </label>
                    <input
                      type="date"
                      className="w-full border rounded px-2 py-1"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Tag */}
              <div className="w-full sm:w-[200px]">
                <label className="text-sm text-gray-500 block mb-1">
                  {noticeBoardConfig.filterLabels.tag}
                </label>
                <select
                  className="w-full border rounded px-3 py-1 outline-none"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                >
                  {noticeBoardConfig.tagOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}

                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-between gap-4 mt-auto">
              <button onClick={handleClear} className="px-4 py-1 border rounded">
                {noticeBoardConfig.buttons.clear}
              </button>
              <button onClick={handleApply} className="px-4 py-1 bg-teal text-white rounded">
                {noticeBoardConfig.buttons.apply}
              </button>
            </div>
          </div>
        )}
      </div>

      {filteredData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] w-full">
          <p className="text-gray-500 text-center text-2xl font-semibold px-4">
            No official notices are available now.<br />
            Please revisit this section for future updates and announcements.
          </p>
        </div>
      ) : (
        <FeaturesTable data={filteredData} />
      )}
    </div>
  );
};

export default NoticeBoard;
