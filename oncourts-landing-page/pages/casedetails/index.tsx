import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SingleCase from "./single_case";
import MultipleCase from "./multiple_case";

function CaseDetails() {
  const [data, setData] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();
  const { caseNumber, selectedCaseType, selectedYear, selectedButton } = router.query;

  async function fetchCase(url: string) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.log("Error fetching case summary:", (error as Error).message);
      return null;
    }
  }

  useEffect(() => {
    if (router.isReady) {
      setOffset(0);
    }
  }, [selectedYear, selectedCaseType, selectedButton, caseNumber, router.isReady]);

  useEffect(() => {
    if (!router.isReady) return;
    
    async function searchCaseSummary() {
      setLoading(true);
      setCases([]);
      setData(null);

      let url = "";
      if (selectedButton === "CNR") {
        if (!caseNumber) { router.push("/search"); return; }
        url = `/api/case/cnr/${caseNumber}`;
      } else {
        if (!selectedYear || !selectedCaseType) {
          router.push("/search"); return;
        } else {
          if (!caseNumber) {
            url = `/api/case/${selectedYear}/${selectedCaseType}?offset=${offset}&limit=${limit}`;
          } else {
            url = `/api/case/${selectedYear}/${selectedCaseType}/${caseNumber}`;
          }
        }
      }

      const res = await fetchCase(url);
      if (res) {
        if (selectedButton === "CNR" || caseNumber) {
          setData(res["caseSummary"]);
        } else {
          setCases(res["caseList"]);
          setTotalCount(res?.pagination?.totalCount || 0);
        }
      }
      setLoading(false);
    }

    searchCaseSummary();
  }, [caseNumber, router, selectedButton, selectedCaseType, selectedYear, offset, limit]);

  useEffect(() => {
    if (router.isReady && !loading && !data && cases.length === 0) {
      alert("No case data found.");
      router.push(`/search?selectedButton=${selectedButton}&caseNumber=${caseNumber}&selectedCaseType=${selectedCaseType}&selectedYear=${selectedYear}`);
    }
  }, [loading, data, cases, router, router.isReady, selectedButton, caseNumber, selectedCaseType, selectedYear]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {data ? (
        <SingleCase data={data} />
      ) : cases?.length > 0 ? (
        <>
          <MultipleCase cases={cases} offset={offset} />
          <div className="flex items-center justify-between px-2 pt-4">
            <div className="flex items-center gap-2 text-sm">
              <label htmlFor="limit" className="text-gray-600">Results per page:</label>
              <select
                id="limit"
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5, 10, 15, 20].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="ml-4 text-gray-600">
                Page {Math.floor(offset / limit) + 1} of {Math.ceil(totalCount / limit)}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                disabled={offset === 0}
                onClick={() => setOffset(prev => Math.max(0, prev - limit))}
                className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                disabled={offset + limit >= totalCount}
                onClick={() => setOffset(prev => prev + limit)}
                className="px-3 py-1 rounded-md bg-[#007E7E] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default CaseDetails;