const CNRForm = ({ caseNumber, setCaseNumber, config }) => (
  <div className="mb-4">
    <label htmlFor="cnrInput" className="text-teal font-normal text-sm">
      {config.label}
    </label>
    <div className="rounded-xl border-2 border-teal p-2 mt-2">
      <input
        type="text"
        id="cnrInput"
        value={caseNumber}
        onChange={(e) => setCaseNumber(e.target.value)}
        placeholder={config.placeholder}
        className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
      />
    </div>
  </div>
);

export default CNRForm;
