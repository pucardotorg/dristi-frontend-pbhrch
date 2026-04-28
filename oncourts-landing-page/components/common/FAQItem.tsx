interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onClick,
}) => {
  return (
    <div className="border-b border-[#CBD5E1]">
      <div
        className="flex justify-between items-center py-4 md:py-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] cursor-pointer font-medium"
        onClick={onClick}
      >
        <h3 className="text-xl md:text-[clamp(16.75px,calc(16.75px+((26-16.75)*((100vw-1200px)/662))),26px)] font-medium text-[#3A3A3A] tracking-[-0.26px]">
          {question}
        </h3>
        <div className="text-teal-600">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] md:w-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] md:w-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="pb-6 md:pb-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] text-[15px] md:text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] text-[#334155] tracking-[-0.2px] font-normal">
          {answer}
        </div>
      )}
    </div>
  );
};

export default FAQItem;
