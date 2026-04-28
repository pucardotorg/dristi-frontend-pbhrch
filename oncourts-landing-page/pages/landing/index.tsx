import React from "react";
import HomeIntroVideo from "../../components/HomePage/HomeIntroVideo";
import InfoBanner from "../../components/InfoBanner";
import Highlights from "../../components/HomePage/Highlights";
import QuestionsSection from "../../components/HomePage/QuestionsSection";
import HomeCauseLists from "../../components/HomePage/HomeCauseLists";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Hero = () => {
  return (
    <div className="w-full space-y-0 overflow-x-hidden">
      <InfoBanner />
      <HomeIntroVideo />
      <HomeCauseLists />
      <Highlights />
      <QuestionsSection />
    </div>
  );
};

export default Hero;
