import Image from "next/image";
import { benifitsData } from "../../data/about";
import AccordionItem from "../Utils/AccordionItem";
import { useState } from "react";

export default function Benifits() {
  const [openIndices, setOpenIndices] = useState({
    litigants: null,
    advocates: null,
    advocateClerks: null,
    judges: null,
    courtStaffs: null,
  });
  const rolesMapping = {
    litigants: "Litigants",
    advocates: "Advocates",
    advocateClerks: "Advocate Clerks",
    judges: "Judges",
    courtStaffs: "Court Staffs",
  };

  const handleToggle = (section, index) => {
    setOpenIndices((prevState) => ({
      ...prevState,
      [section]: prevState[section] === index ? null : index,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mx-auto max-w-[95%] mt-4 px-8 py-12 text-center text-[20px]">
      <h2 className="text-[64px] font-bold text-teal text-center mb-2">
        {benifitsData.title}
      </h2>
      <h4 className="text-[32px] text-center mb-8">{benifitsData.subTitle}</h4>
      {Object.entries(benifitsData.roles).map(([role, data], index) => {
        const isEven = index % 2 === 0;
        return (
          <div
            key={role}
            className={`flex mb-12 justify-between text-start items-start`}
          >
            {/* Left Section */}
            {isEven ? (
              <>
                <div className="w-1/2 pr-8">
                  <h3 className="text-[32px] font-bold text-teal mb-4 capitalize">
                    {rolesMapping[role]}
                  </h3>
                  <div className="mb-8">
                    {data.map((item, i) => (
                      <AccordionItem
                        key={i}
                        title={item.title}
                        content={item.content}
                        isOpen={openIndices[role] === i}
                        onToggle={() => handleToggle(role, i)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-center items-center w-1/2">
                  <Image
                    src={`/images/roles/${role}.png`}
                    alt={`${role} Image`}
                    width={200}
                    height={100}
                    className="object-cover"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center items-center w-1/2">
                  <Image
                    src={`/images/roles/${role}.png`}
                    alt={`${role} Image`}
                    width={200}
                    height={100}
                    className="object-cover"
                  />
                </div>

                <div className="w-1/2 pr-8">
                  <h3 className="text-[32px] font-bold text-teal mb-4 capitalize">
                    {rolesMapping[role]}
                  </h3>
                  <div className="mb-8">
                    {data.map((item, i) => (
                      <AccordionItem
                        key={i}
                        title={item.title}
                        content={item.content}
                        isOpen={openIndices[role] === i}
                        onToggle={() => handleToggle(role, i)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
