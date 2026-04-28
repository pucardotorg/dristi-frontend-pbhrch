import React from "react";
import Vision from "../../components/AboutUs/Vision";
import GuidingPrinciples from "../../components/AboutUs/GuidingPrinciples";
import ONCourtsExperience from "../../components/AboutUs/ONCourtsExperience";
import Benefits from "../../components/AboutUs/Benefits";
import Jurisdiction from "../../components/AboutUs/Jurisdiction";
import UserVoices from "../../components/AboutUs/UserVoices";
import Head from "next/head";
import { useMediaQuery } from "@mui/system";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

export default function About() {
  const { t } = useSafeTranslation();
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <>
      <Head>
        <title>{t("ABOUT_ON_COURTS")}</title>
        <meta
          name="description"
          content="Learn about ON Courts, our vision, principles, and how we're transforming the judicial experience"
        />
      </Head>

      {/* Main content in requested sequence */}
      <Vision />
      <GuidingPrinciples />
      {/* <Technology />' */}
      <ONCourtsExperience />
      <Benefits />
      <Jurisdiction isMobile={isMobile} />
      <UserVoices />
    </>
  );
}
