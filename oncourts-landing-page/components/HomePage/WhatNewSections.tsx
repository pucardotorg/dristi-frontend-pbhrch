import { whatsNewData, WhatsNewSection } from "../../data/whatsNewConfig";
import { svgIcons } from "../../data/svgIcons";
import Link from "next/link";
import WhatsNewCard from "./WhatsNewCard";
import { useEffect, useState } from "react";
import { transformWhatsNewResponse } from "../../TransformData/transformResponseData";

const WhatsNewSections: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [latestUpgrades, setLatestUpgrades] = useState<WhatsNewSection>({
    title: "",
    subTitle: "",
    data: [],
  });

  const [upcomingFeatures, setUpcomingFeatures] = useState<WhatsNewSection>({
    title: "",
    subTitle: "",
    data: [],
  });

  useEffect(() => {
    const fetchWhatsNew = async () => {
      try {
        const res = await fetch("/api/whatsNew");
        const data = await res.json();

        const transformed = transformWhatsNewResponse(data);
        setLatestUpgrades(transformed?.latestUpgrades);
        setUpcomingFeatures(transformed?.upcomingFeatures);
      } catch (error) {
        console.error("Failed to fetch Whats New data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWhatsNew();
  }, []);
  return (
    <section className="bg-tealBg py-12 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-teal ">
          {whatsNewData.title}
        </h2>
        <p className="mt-4 text-darkGrey text-lg">{whatsNewData.description}</p>
      </div>

      <div className="mt-10 grid gap-12 md:grid-cols-2 max-w-6xl mx-auto">
        {[latestUpgrades, upcomingFeatures].map((section, index) => (
          <WhatsNewCard key={index} section={section} loading={loading} />
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/whats-new"
          className="text-teal hover:underline inline-flex items-center space-x-1"
        >
          <span className="text-xl font-semibold">Know more</span>
          <svgIcons.RightArrow />
        </Link>
      </div>
    </section>
  );
};

export default WhatsNewSections;
