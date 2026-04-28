const CaseNumberForm = ({
  caseNumber,
  setCaseNumber,
  selectedCaseType,
  setSelectedCaseType,
  selectedYear,
  setSelectedYear,
  config,
}) => {

  const handleChange = (e) => {
    const value = e.target.value.trim();
    setCaseNumber(value);

    if (value === "") {
      setSelectedCaseType("");
      setSelectedYear("");
    } else {
      const parts = value.split('/');
      if (parts.length === 3) {
        const [caseType, , year] = parts;
        if (caseType) setSelectedCaseType(caseType);
        if (year) setSelectedYear(year);
      }
    }
  }

  return (
    <>
      <div className="mb-4">
        <label htmlFor="caseType" className="text-teal font-normal text-sm">
          {config.caseTypeLabel}
        </label>
        <div className="w-full rounded-2xl border border-teal p-4 mt-2">
          <select
            id="caseType"
            value={selectedCaseType}
            // value={caseNumber ? "" : selectedCaseType}
            // disabled={!!caseNumber}
            onChange={(e) => setSelectedCaseType(e.target.value)}
            // className={`w-full py-2 px-4 rounded-2xl outline-none bg-transparent transition-all duration-300 ${caseNumber ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
            className={`w-full py-2 px-4 rounded-2xl outline-none bg-transparent transition-all duration-300`}
            required
          >
            <option value="" disabled hidden>
              {config.caseTypeLabel}
            </option>
            {config.caseTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap justify-between space-x-4">
        <div>
          <label htmlFor="caseNumberInput" className="text-teal font-normal text-sm">
            {config.caseNumberLabel}
          </label>
          <div className="rounded-2xl border border-teal p-2 mt-1">
            <input
              type="text"
              id="caseNumberInput"
              value={caseNumber}
              onChange={handleChange}
              placeholder={config.placeholders[selectedCaseType as "CMP" | "ST"]}
              className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <label htmlFor="yearInput" className="text-teal font-normal text-sm">
            {config.yearLabel}
          </label>
          <div className="rounded-2xl border border-teal p-2 mt-1">
            <select
              id="yearInput"
              value={selectedYear}
              // value={caseNumber ? "" : selectedYear}
              // disabled={!!caseNumber}
              onChange={(e) => setSelectedYear(e.target.value)}
              // className={`w-full py-2 px-4 rounded-2xl outline-none bg-transparent transition-all duration-300 ${caseNumber ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
              className={`w-full py-2 px-4 rounded-2xl outline-none bg-transparent transition-all duration-300`}
              required
            >
              <option value="" disabled hidden>
                {config.yearLabel}
              </option>
              {config.years.map((year: string) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}

export default CaseNumberForm;
