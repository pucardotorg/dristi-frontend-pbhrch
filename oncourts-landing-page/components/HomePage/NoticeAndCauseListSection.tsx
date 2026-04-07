import React, { useEffect, useState } from "react";
import CourtListingSection from "./CourtListingSection";
import { sampleNoticeItems } from "../../data/courtListingData";
import { transformCauseList } from "../../TransformData/transformResponseData";

export interface RecentCauseListItem {
  courtId: string;
  fileStoreId: string | null;
  date: string;
}

export interface RecentCauseListResponse {
  ResponseInfo: { [key: string]: unknown; }
  RecentCauseList: RecentCauseListItem[];
}

export interface CauseListItem {
  id: string;
  title: string;
  date: Date;
  fileStoreId: string | null;
}

const NoticeAndCauseListSection: React.FC = () => {
  const [causeList, setCauseList] = useState<CauseListItem[]>([]);
  // [
  //   {
  //     id: "1",
  //     title: "16 April Causelist - 24x7 ON Court",
  //     date: new Date("2025-04-16T00:00:00.000Z"),
  //     fileStoreId: "83d24a56-d4f9-4d6f-ae52-b8df93b543a7"
  //   },
  //   {
  //     id: "2",
  //     title: "15 April Causelist - 24x7 ON Court",
  //     date: new Date("2025-04-15T00:00:00.000Z"),
  //     fileStoreId: "a82dde14-38ff-44ae-b004-55f132d9318a"
  //   }
  // ]

  useEffect(() => {
    const fetchCauseList = async () => {
      try {
        const res = await fetch("/api/_recentCauseList");
        const data = await res.json();

        const transformed = transformCauseList(data);
        setCauseList(transformed || []);
      } catch (error) {
        console.error("Failed to fetch Whats New data", error);
      }
    };

    fetchCauseList();
  }, []);

  return (
    <CourtListingSection
      CauseListItem={causeList}
      noticeItems={sampleNoticeItems}
    />
  )
};

export default NoticeAndCauseListSection;
