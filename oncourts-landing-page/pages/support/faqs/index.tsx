import { useState } from "react";
import AccordionItem from "../../../components/Utils/AccordionItem";
import { contactBoxItems, leftColumnItems, rightColumnItems } from "../../../data/faq";
import ContactPopup from "../../../components/Utils/ContactPopUp";

export default function Faq() {
    const [openIndices, setOpenIndices] = useState({ left: null, right: null });
    const [showPopup, setShowPopup] = useState(false);

    const handleToggle = (side, index) => {
        setOpenIndices((prev) => ({
            ...prev,
            [side]: prev[side] === index ? null : index,
        }));
    };

    return (
        <section className="px-4 md:px-12 py-12 md:py-20 bg-gray-50">
            <div className="mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center text-teal mb-12">
                    Frequently Asked Questions (FAQs)
                </h2>

                <div className="px-12 text-[20px] grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left Column */}
                    <div>
                        {leftColumnItems.map((item, index) => (
                            <AccordionItem
                                key={index}
                                title={item.title}
                                content={item.content}
                                isOpen={openIndices.left === index}
                                onToggle={() => handleToggle("left", index)}
                            />
                        ))}
                    </div>

                    {/* Right Column */}
                    <div>
                        {rightColumnItems.map((item, index) => (
                            <AccordionItem
                                key={index}
                                title={item.title}
                                content={item.content}
                                isOpen={openIndices.right === index}
                                onToggle={() => handleToggle("right", index)}
                            />
                        ))}
                    </div>
                </div>
                <div className="relative mt-16 rounded border border-teal bg-teal/10 px-6 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-teal mb-1">{contactBoxItems.title}</h3>
                        <p className="text-gray-700">
                            {contactBoxItems.content}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowPopup(true)}
                        className="mt-4 md:mt-0 bg-white text-teal font-medium px-5 py-2 rounded shadow hover:bg-gray-100 transition"
                    >
                        {contactBoxItems.buttonText}
                    </button>
                    {showPopup && (
                        <div className="absolute bottom-full right-0 mb-2 z-50">
                            <ContactPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}


