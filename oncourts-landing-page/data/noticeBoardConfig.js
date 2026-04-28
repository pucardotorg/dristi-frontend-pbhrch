export const noticeBoardConfig = {
  heading: "Notice Board",
  filterLabels: {
    timePeriod: "Time period",
    startDate: "Start Date",
    endDate: "End Date",
    tag: "Tags",
  },
  placeholders: {
    search: "Search",
  },
  timePeriods: [
    { value: "all", label: "All time" },
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "6months", label: "Last 6 months" },
    { value: "custom", label: "Custom Range" },
  ],
  tagOptions: [
    { value: "all", label: "all" },
    { value: "Magistrate", label: "Magistrate" },
    { value: "Courtstaff", label: "Courtstaff" },
    { value: "Advocate", label: "Advocate" },
    { value: "Advocate Clerk", label: "Advocate Clerk" },
    { value: "Litigant", label: "Litigant" },
  ],
  buttons: {
    clear: "Clear",
    apply: "Apply",
  },
};
