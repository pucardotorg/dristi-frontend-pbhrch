export default function AccordionItem({ title, content, isOpen, onToggle }) {

    return (
        <div className="border-b border-gray-300">
            <button
                onClick={onToggle}
                className={`flex justify-between w-full py-4 text-left focus:outline-none ${isOpen && "text-teal"}`}
                aria-expanded={isOpen}
                aria-controls={`content-${title?.replace(/\s+/g, "-").toLowerCase()}`}
            >
                <span className={isOpen ? "font-bold" : ""}>{title}</span>
                <span className="text-2xl">{isOpen ? "-" : "+"}</span>
            </button>
            {isOpen && <div className="pb-4">{content}</div>}
        </div>
    );
};
