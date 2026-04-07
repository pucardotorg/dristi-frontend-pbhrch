import Image from "next/image";
import { judges } from "../../../data/judges.js";

export default function Judges() {
  const { sectionTitles, highCourt, current, former } = judges;

  return (
    <>
      <div className="relative left-0 w-full h-[431px]">
        <div className="relative w-full h-[300px]">
          <Image
            src="/images/justice.png"
            alt="Header Background"
            layout="fill"
            objectFit="cover"
            className="z-0 top-10"
          />
        </div>

        <div className="-mt-[200px] z-10 relative px-4 sm:px-8 md:px-16">
          <h1 className="text-5xl font-bold text-center mb-32 text-white text-[94px]">
            {sectionTitles.main}
          </h1>
        </div>
      </div>
      <section className="py-16 -mt-[100px]">
        <h2 className="text-center text-[#007E7E] text-5xl font-semibold mb-12">
          {sectionTitles.highCourt}
        </h2>
        <div className="flex justify-center gap-10 flex-wrap mb-12">
          {highCourt.map((judge) => (
            <div
              key={judge.name}
              className="w-[298px] bg-white rounded-xl border border-[#EAECF0] shadow-[0px_4px_12px_0px_#007E7E7A] p-2"
            >
              <Image
                src={judge.image}
                alt={judge.name}
                width={298}
                height={298}
                className="w-full h-[298px] object-cover object-top rounded-t"
              />
              <div className="p-5">
                <h2 className="text-[#007E7E] text-base font-semibold">
                  {judge.name}
                </h2>
                <p className="text-gray-600 text-base">{judge.title}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-center text-[#007E7E] text-4xl font-semibold mb-6 mt-16">
          {sectionTitles.current}
        </h2>
        <div className="flex justify-center gap-10 flex-wrap mb-12">
          {current.map((judge) => (
            <div
              key={judge.name}
              className="w-[298px] bg-white rounded-xl border border-[#EAECF0] shadow-[0px_4px_12px_0px_#007E7E7A] p-2"
            >
              <Image
                src={judge.image}
                alt={judge.name}
                width={298}
                height={298}
                className="w-full h-[298px] object-cover object-top rounded-t"
              />
              <div className="p-5">
                <h2 className="text-[#007E7E] text-base font-semibold">
                  {judge.name}
                </h2>
                <p className="text-gray-600 text-base">{judge.title}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-center text-[#007E7E] text-4xl font-semibold mb-6 mt-16">
          {sectionTitles.former}
        </h2>
        <div className="flex justify-center gap-10 flex-wrap">
          {former.map((judge) => (
            <div
              key={judge.name}
              className="w-[298px] bg-white rounded-xl border border-[#EAECF0] shadow-[0px_4px_12px_0px_#007E7E7A] p-2"
            >
              <Image
                src={judge.image}
                alt={judge.name}
                width={298}
                height={298}
                className="w-full h-[298px] object-cover object-top rounded-t"
              />
              <div className="p-5">
                <h2 className="text-[#007E7E] text-base font-semibold">
                  {judge.name}
                </h2>
                <p className="text-gray-600 text-base">{judge.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
