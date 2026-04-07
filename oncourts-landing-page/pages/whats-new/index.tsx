import { useEffect, useState } from "react";
import FeaturesTable from "../../components/Utils/FeaturesTable";
import { transformWhatsNewResponse } from "../../TransformData/transformResponseData";
import { WhatsNewSection } from "../../data/whatsNewConfig";

const WhatNew = () => {
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
      }
    };

    fetchWhatsNew();
  }, []);

  const liveNowFeatures = (latestUpgrades?.data || []).map((item, index) => ({
    "S.No.": index + 1,
    "Feature Description": `${item?.itemName} | ${item?.itemDescription}`,
    "Released In": item?.itemDateAdded,
  }));

  const comingSoon = (upcomingFeatures?.data || []).map((item, index) => ({
    "S.No.": index + 1,
    "Feature Description": `${item?.itemName} | ${item?.itemDescription}`,
  }));

  return (
    <div className="relative mx-auto mb-12 left-1/2 transform -translate-x-1/2 w-full max-w-[1858px] h-auto px-4 sm:px-8 gap-4 flex flex-col items-start">
      <div className="w-full flex flex-col items-center gap-4">
        <h1 className="text-[#007E7E] text-[36px] md:text-[48px] lg:text-[60px] font-bold leading-tight text-center mt-6 md:mt-12">
          What’s New in 24x7 ON Courts
        </h1>
      </div>

      <FeaturesTable
        heading="Live Now: Latest Upgrades in ON Court"
        data={liveNowFeatures}
      />

      <FeaturesTable
        heading="Coming Soon: Upcoming Features in ON Court"
        data={comingSoon}
      />
    </div>
  );
};

export default WhatNew;
