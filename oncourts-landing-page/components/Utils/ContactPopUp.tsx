import { useRef, useEffect } from "react";
import { contactInfo } from "../../data/contactInfo";
import { svgIcons } from "../../data/svgIcons";

export default function ContactPopup({ isOpen, onClose }) {
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    const CloseIcon = svgIcons.Close;

    return (
        <div className="z-50 flex items-center justify-center">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl p-6  relative text-teal"
            >
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
                    <CloseIcon />
                </button>

                <div className="m-6 text-sm md:text-base space-y-3">
                    {contactInfo.map((item, idx) => {
                        const IconComponent = svgIcons[item.icon as keyof typeof svgIcons];
                        return (
                            <div key={idx}>
                                <p className="flex items-start gap-8">
                                    <IconComponent />
                                    <span>
                                        <span>
                                            {item.label && <span className="font-semibold">{item.label} </span>}
                                            {item.type === "email" ? (
                                                <a href={item.link} className="underline">
                                                    {item.value}
                                                </a>
                                            ) : (
                                                item.value
                                            )}
                                        </span>
                                        {item.subtext && (
                                            <p className="text-gray-600 text-xs md:text-sm">{item.subtext}</p>
                                        )}
                                    </span>
                                </p>

                                <hr className="my-2" />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
