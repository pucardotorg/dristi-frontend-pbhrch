export const formatDate = (
  dateInput?: string | number | Date | null,
  format: string ="dd-MMM-yyyy",
): string => {
  if (!dateInput) return "";

  let date: Date;

  try {
    // Handle "23-01-2026"
    if (typeof dateInput === "string" && /^\d{2}-\d{2}-\d{4}$/.test(dateInput)) {
      const [day, month, year] = dateInput.split("-");
      date = new Date(Number(year), Number(month) - 1, Number(day));
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return String(dateInput);

    // Format: March 12, 2026
    if (format === "long") {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date);
    }

    const day = String(date.getDate()).padStart(2, "0");
    const monthNumber = String(date.getMonth() + 1).padStart(2, "0");
    const monthShort = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    if (format === "dd-MM-yyyy") {
      return `${day}-${monthNumber}-${year}`;
    }

    if (format === "dd-MMM-yyyy") {
      return `${day}-${monthShort}-${year}`;
    }

    if (format === "dd/MM/yyyy") {
      return `${day}/${monthNumber}/${year}`;
    }

    return date.toLocaleDateString();
  } catch {
    return String(dateInput);
  }
};