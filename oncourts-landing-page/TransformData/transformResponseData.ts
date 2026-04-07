import { WhatsNewItem, WhatsNewSection } from "../data/whatsNewConfig";
import {
  CauseListItem,
  RecentCauseListResponse,
} from "../components/HomePage/NoticeAndCauseListSection";
import { DashboardMetricsNew } from "../components/HomePage/Highlights";

export interface MdmsApiResponse {
  MdmsRes: {
    LandingPage: {
      LatestAndComingSoon?: WhatsNewItem[];
      DashboardMeterics?: DashboardMetricsNew[];
    };
  };
}

export function transformWhatsNewResponse(data: MdmsApiResponse): {
  latestUpgrades: WhatsNewSection;
  upcomingFeatures: WhatsNewSection;
} {
  const allItems = data?.MdmsRes?.LandingPage?.LatestAndComingSoon || [];

  const liveNowItems = allItems
    ?.filter((item) => item?.itemCategory === "LIVE_NOW")
    ?.sort((a, b) => (Number(a?.itemId) || 0) - (Number(b?.itemId) || 0));

  const comingSoonItems = allItems
    ?.filter((item) => item?.itemCategory === "COMING_SOON")
    ?.sort((a, b) => (Number(a?.itemId) || 0) - (Number(b?.itemId) || 0));

  return {
    latestUpgrades: {
      title: "Live Now: Latest Upgrades in ON Court",
      subTitle: "Discover the latest features on the 24x7 ON Court platform",
      data: liveNowItems,
    },
    upcomingFeatures: {
      title: "Coming Soon: What’s Next?",
      subTitle: "Exciting new features are on the way!",
      data: comingSoonItems,
    },
  };
}

export function transformImpactGlance(data: MdmsApiResponse): {
  stats: DashboardMetricsNew;
} {
  const allItems = data?.MdmsRes?.LandingPage?.DashboardMeterics || [];
  return {
    stats: allItems[0],
  };
}

export function transformCauseList(
  data: RecentCauseListResponse
): CauseListItem[] {
  const list = data?.RecentCauseList || [];

  return list
    .map((item, index) => {
      const date = new Date(item.date);
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-IN", options);
      const title = `${formattedDate} Causelist - 24x7 ON Court`;

      return {
        id: `${index + 1}`,
        title,
        date,
        fileStoreId: item.fileStoreId,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
