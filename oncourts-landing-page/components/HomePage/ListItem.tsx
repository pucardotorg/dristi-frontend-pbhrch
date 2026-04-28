import { FaCalendarAlt } from "react-icons/fa";

interface ListItemProps {
  title: string;
  date: string;
}

const ListItem: React.FC<ListItemProps> = ({ title, date }) => {
  const tenantId = localStorage.getItem("tenant-id") || "kl";

  const handleDownload = async () => {
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
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `causelist-${date}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Download failed:", (error as Error).message);
      alert(
        `Failed to download: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border rounded-lg shadow-md bg-white">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 flex items-center gap-2">
          <FaCalendarAlt className="text-gray-500" />
          Date : {date}
        </p>
      </div>
      <button
        className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm"
        onClick={handleDownload}
      >
        Download
      </button>
    </div>
  );
};

export default ListItem;
