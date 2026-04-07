import React, { useCallback, useEffect, useState } from "react";
import { svgIcons } from "../data/svgIcons";
import { useMediaQuery } from "@mui/material";

const InfoBanner: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const tenantId = localStorage.getItem("tenant-id") || "kl";
  const [messages, setMessages] = useState<string[]>([]);

  const getInfoMessage = useCallback(async () => {
    try {
      const response = await fetch(
        `/egov-mdms-service/v1/_search?tenantId=${tenantId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            MdmsCriteria: {
              tenantId: tenantId,
              moduleDetails: [
                {
                  moduleName: "LandingPage",
                  masterDetails: [{ name: "NotificationMessage" }],
                },
              ],
            },
            RequestInfo: {
              apiId: "Rainmaker",
              msgId: `${Date.now()}|en_IN`,
            },
          }),
        },
      );
      const data = await response.json();
      const message =
        data?.MdmsRes?.["LandingPage"]?.NotificationMessage?.[0]?.message;
      if (Boolean(message)) {
        setMessages([message]);
      }
    } catch (error) {
      console.error("Error fetching court options:", error);
      setMessages([]);
    }
  }, [tenantId]);

  useEffect(() => {
    getInfoMessage();
  }, []);

  const message = messages?.[0];
  const MessageContent = () => (
    <div className="flex items-center">
      <div className="flex items-center space-x-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)]">
        <svgIcons.ClockIcon2
          width={
            isMobile
              ? "22px"
              : "clamp(20.62px, calc(20.62px + ((32 - 20.62) * ((100vw - 1200px) / 662))), 32px)"
          }
        />

        <h4
          className={`text-[#3A3A3A] font-sans font-medium tracking-[0.01em] text-center ${
            isMobile
              ? "text-[15px] leading-[18px]"
              : "text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] leading-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)]"
          }`}
        >
          {message}
        </h4>
      </div>
      <div
        className={`${isMobile ? "h-[28px]" : "h-[clamp(18.06px,calc(18.06px+((28-18.06)*((100vw-1200px)/662))),28px)]"} w-[1px] bg-[#CBD5E1]`}
      ></div>
    </div>
  );

  if (!Boolean(messages?.[0])) {
    return null;
  }

  return (
    <div
      className={`flex items-center bg-[#F0FDFA] border-b border-t border-[#E2E8F0] ${
        isMobile
          ? "py-2 h-[43px]"
          : "py-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] h-[clamp(43.85px,calc(43.85px+((68-43.85)*((100vw-1200px)/662))),68px)]"
      } overflow-hidden`}
    >
      <div className="relative flex whitespace-nowrap animate-marquee">
        <MessageContent />
        <MessageContent />
        <MessageContent />
        <MessageContent />
      </div>
    </div>
  );
};

export default InfoBanner;
