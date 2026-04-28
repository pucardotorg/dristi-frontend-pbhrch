import React from "react";
import { useRouter } from "next/router";

const MultipleCase = ({ cases, offset }) => {
  const router = useRouter();
  if (!cases) return <div>No case data found.</div>;

  const handleViewClick = (caseItem) => {
    const caseNumber = caseItem.caseNumber

    const queryParams: {
      caseNumber?: string;
      selectedCaseType?: string;
      selectedYear?: string;
      selectedButton?: string
    } = {};

    if (caseNumber) {
      if (caseNumber.includes("/")) {
        queryParams.caseNumber = caseNumber.split("/")[1];
        queryParams.selectedCaseType = caseNumber.split("/")[0];
        queryParams.selectedYear = caseNumber.split("/")[2];
        queryParams.selectedButton = "caseNumber";
      } else {
        queryParams.caseNumber = caseNumber;
        queryParams.selectedButton = "CNR";
      }
    } else {
      router.push("/search"); return;
    }

    router.push({
      pathname: "/casedetails",
      query: queryParams,
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Case Table</h1>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left border-b">Serial Number</th>
            <th className="px-4 py-2 text-left border-b">Case Number</th>
            <th className="px-4 py-2 text-left border-b">Case Title</th>
            <th className="px-4 py-2 text-left border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {cases && cases.length > 0 ? (
            cases.map((caseItem, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{offset + index + 1}</td>
                <td className="px-4 py-2">{caseItem.caseNumber}</td>
                <td className="px-4 py-2">{caseItem.caseTitle}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleViewClick(caseItem)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                No cases found.
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
};

export default MultipleCase;