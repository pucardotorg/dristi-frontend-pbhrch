import { useState } from "react";
import { svgIcons } from "../../data/svgIcons";
import ContactPopup from "./ContactPopUp";

export default function StickyHelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="z-50">
      {/* Contact Popup - separate from the sticky */}
      {isOpen && (
        <div className="fixed top-1/2 right-20 transform -translate-y-1/2 z-50">
          <ContactPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Sticky Button */}
      <div className="fixed top-1/2 right-0 transform -translate-y-1/2 group z-50">
        <div
          className="bg-[#007F7E] text-white flex items-center gap-2 pr-4 pl-3 py-2 rounded-l-lg
                overflow-hidden cursor-pointer transition-all duration-300 ease-in-out w-16 
                group-hover:w-44 shadow-md"
          onClick={togglePopup}
        >
          <div className="shrink-0">
            <svgIcons.ConversationIcon />
          </div>
          <span
            className="whitespace-nowrap text-base font-light tracking-wide opacity-0 
                   group-hover:opacity-100 transition-opacity duration-300"
          >
            Need Help?
          </span>
        </div>
      </div>
    </div>
  );
}
