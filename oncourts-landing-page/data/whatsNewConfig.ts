export interface WhatsNewItem {
  itemId: string;
  itemName: string;
  itemCategory: "LIVE_NOW" | "COMING_SOON";
  itemDateAdded: string;
  itemDescription: string;
}

export interface WhatsNewSection {
  title: string;
  subTitle: string;
  data: WhatsNewItem[];
}

export const whatsNewData = {
  title: "What's New in 24x7 ON Courts?",
  description:
    "Stay updated with the latest improvements and upcoming features designed to enhance your experience. Explore the latest upgrades in 24x7 ON Court and get a glimpse of what’s coming next!",
  latestUpgrades: {
    title: "Live Now: Latest Upgrades in ON Court",
    subTitle: "Discover the latest features on the 24x7 ON Court platform",
    data: [
      {
        itemId: "1",
        itemName: "Profile Editing",
        itemCategory: "LIVE_NOW",
        itemDateAdded: "April 2025",
        itemDescription:
          "Complainants can now request edits to party details directly from the case file; multiple accused addresses are also supported upon judge approval.",
      },
    ],
  },
  upcomingFeatures: {
    title: "Coming Soon: What’s Next?",
    subTitle: "Exciting new features are on the way!",
    data: [
      {
        itemId: "1",
        itemName: "Profile Editing",
        itemCategory: "COMING_SOON",
        itemDateAdded: "April 2025",
        itemDescription:
          "Complainants can now request edits to party details directly from the case file; multiple accused addresses are also supported upon judge approval.",
      },
    ],
  },
};
