const SubmitButtons = ({ handleClear, handleSubmit, isSubmitDisabled, config }) => (
  <div className="flex justify-around mx-28">
    <button
      onClick={handleClear}
      className="py-2 px-6 rounded-2xl border border-teal text-teal"
    >
      {config.clear}
    </button>
    <button
      onClick={handleSubmit}
      className={`py-2 px-6 rounded-2xl bg-teal text-white transition-opacity ${!isSubmitDisabled ? "opacity-100" : "opacity-50 cursor-not-allowed"
        }`}
      disabled={isSubmitDisabled}
    >
      {config.submit}
    </button>
  </div>
);

export default SubmitButtons;
