import React from "react";
import Head from "next/head";
import ActionCard from "../../components/common/ActionCard";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { svgIcons } from "../../data/svgIcons";
import { useRouter } from "next/router";
import { useMediaQuery } from "@mui/material";
import { ctcStyles, ctcText } from "../../styles/certifiedCopyStyles";

const CertifiedTrueCopies = () => {
  const { t } = useSafeTranslation();
  const isMobile = useMediaQuery("(max-width:640px)");
  const router = useRouter();

  return (
    <div className={ctcStyles.page}>
      <Head>
        <title>{t(ctcText.landing.pageTitle)}</title>
      </Head>

      <div className="w-full mx-auto">
        <h1
          className={
            isMobile
              ? ctcStyles.pageHeadingMobile
              : ctcStyles.pageHeadingDesktop
          }
          style={ctcStyles.pageHeadingStyle}
        >
          {t(ctcText.landing.pageTitle)}
        </h1>

        <div className={ctcStyles.actionCardRow}>
          <ActionCard
            t={t}
            icon={svgIcons.CertifiedDocumentIcon()}
            title={ctcText.landing.applyTitle}
            description={ctcText.landing.applyDescription}
            buttonText={ctcText.landing.applyButton}
            buttonVariant="solid"
            onClick={() => router.push("/certified-true-copies/apply")}
          />

          <ActionCard
            t={t}
            icon={svgIcons.ViewApplicationIcon()}
            title={ctcText.landing.trackTitle}
            description={ctcText.landing.trackDescription}
            buttonText={ctcText.landing.trackButton}
            buttonVariant="outline"
            onClick={() =>
              router.push("/certified-true-copies/view-status-application")
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CertifiedTrueCopies;
