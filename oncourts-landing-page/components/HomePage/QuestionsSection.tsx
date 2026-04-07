import React, { useState } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { svgIcons } from "../../data/svgIcons";
import Link from "next/link";
import { useMediaQuery } from "@mui/material";
import { APP_URLS } from "../../lib/config";
import router from "next/router";

interface QuestionProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  id: number;
  setQuestionRef: (el: HTMLDivElement | null, id: number) => void;
}

const Question: React.FC<QuestionProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
  isMobile,
  id,
  setQuestionRef,
}) => {
  return (
    <div
      ref={(el) => setQuestionRef(el, id)}
      className="border-b border-[#CBD5E1]"
    >
      <button
        className="w-full text-left py-[clamp(15.46px,calc(15.46px+((24-15.46)*((100vw-1200px)/662))),24px)]"
        onClick={(e) => {
          e.preventDefault();
          onToggle();
        }}
      >
        <div className="flex items-start justify-between">
          <span
            className={`font-roboto font-medium tracking-[-0.26px] text-[#3A3A3A] pr-8 ${isMobile ? "text-[20px] leading-[24px]" : "text-[clamp(16.75px,calc(16.75px+((26-16.75)*((100vw-1200px)/662))),26px)] leading-[clamp(23.18px,calc(23.18px+((36-23.18)*((100vw-1200px)/662))),36px)]"}`}
          >
            {question}
          </span>
          <span className={`flex-shrink-0  ${isMobile ? "" : "mt-[0.5em]"}`}>
            {isOpen ? <svgIcons.UpArrowIcon /> : <svgIcons.DownArrowIcon />}
          </span>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="pb-6">
          <div
            className={`font-roboto tracking-[-0.2px] text-[#334155] ${isMobile ? "text-[15px] leading-[18px]" : "text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] leading-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] font-normal"}`}
          >
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionsSection: React.FC = () => {
  const { t } = useSafeTranslation();
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const questionsRef = React.useRef<{ [key: number]: HTMLDivElement | null }>(
    {}
  );

  const handleQuestionToggle = (id: number) => {
    const isClosing = openQuestionId === id;
    setOpenQuestionId(isClosing ? null : id);

    setTimeout(() => {
      const element = questionsRef.current[id];
      if (!isClosing && element) {
        const rect = element.getBoundingClientRect();
        const scrollPadding = 80;
        const scrollY = window.scrollY;
        const elementTop = scrollY + rect.top;
        const elementBottom = elementTop + element.scrollHeight;

        const viewportTop = scrollY;
        const viewportBottom = scrollY + window.innerHeight;

        const isFullyVisible =
          elementTop >= viewportTop && elementBottom <= viewportBottom;

        if (!isFullyVisible) {
          const maxScrollable = document.body.scrollHeight - window.innerHeight;
          const targetScroll = Math.min(
            elementTop - scrollPadding,
            maxScrollable
          );

          window.scrollTo({
            top: targetScroll,
            behavior: "smooth",
          });
        }
      }
    }, 350);
  };

  const questions = [
    {
      id: 0,
      question: t("WHERE_CHECK_HEARING_DETAILS"),
      answer: (
        <div className="space-y-4 text-[#334155]">
          <p>
            {t("WHERE_CHECK_HEARING_DETAILS_ANSWER_1")}
            <Link href="/search" className="text-[#1D4ED8] hover:underline">
              {t("CASE_SEARCH")}
            </Link>
            {t("WHERE_CHECK_HEARING_DETAILS_ANSWER_2")}
            <span className="font-bold">{t("VIEW_DETAILS")}</span>
            {t("WHERE_CHECK_HEARING_DETAILS_ANSWER_3")}
          </p>
        </div>
      ),
    },
    {
      id: 1,
      question: t("TASKS_I_NEED_TO_COMPLETE_TO_CASE_FORWARD"),
      answer: (
        <div className="space-y-4 text-[#334155]">
          <p>
            {t("TASKS_I_NEED_TO_COMPLETE_TO_CASE_FORWARD_ANS_PART_1")}
            <Link
              href={APP_URLS.CITIZEN_DRISTI}
              className="text-[#1D4ED8] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("ON_COURT_PORTAL")}
            </Link>
            {t("TASKS_I_NEED_TO_COMPLETE_TO_CASE_FORWARD_ANS_PART_2")}
            <Link href="/search" className="text-[#1D4ED8] hover:underline">
              {t("CASE_SEARCH")}
            </Link>
            {t("TASKS_I_NEED_TO_COMPLETE_TO_CASE_FORWARD_ANS_PART_3")}
          </p>
        </div>
      ),
    },
    {
      id: 2,
      question: t(
        "HOW_CAN_I_CHECK_IF_MY_CASES_ARE_SCHEDULED_FOR_HEARING_ON_A_SPECIFIC_DAY"
      ),
      answer: (
        <div className="space-y-4 text-[#334155]">
          <p>
            {t(
              "HOW_CAN_I_CHECK_IF_MY_CASES_ARE_SCHEDULED_FOR_HEARING_ON_A_SPECIFIC_DAY_ANS_PART_1"
            )}
            <Link
              href="/display-board"
              className="text-[#1D4ED8] hover:underline"
            >
              {t("DISPLAY_CAUSELIST_HEADING")}
            </Link>{" "}
            {t(
              "HOW_CAN_I_CHECK_IF_MY_CASES_ARE_SCHEDULED_FOR_HEARING_ON_A_SPECIFIC_DAY_ANS_PART_2"
            )}
          </p>
          <p>
            {t(
              "HOW_CAN_I_CHECK_IF_MY_CASES_ARE_SCHEDULED_FOR_HEARING_ON_A_SPECIFIC_DAY_ANS_PART_3"
            )}
            <Link href="/search" className="text-[#1D4ED8] hover:underline">
              {t("CASE_SEARCH")}
            </Link>{" "}
            {t(
              "HOW_CAN_I_CHECK_IF_MY_CASES_ARE_SCHEDULED_FOR_HEARING_ON_A_SPECIFIC_DAY_ANS_PART_4"
            )}
          </p>
        </div>
      ),
    },
    {
      id: 3,
      question: t("CAN_I_JOIN_MY_HEARING_ONLINE"),
      answer: (
        <div className="space-y-4 text-[#334155]">
          <p>
            {t("CAN_I_JOIN_MY_HEARING_ONLINE_ANS_PART_1")}
            <Link
              href="/display-board"
              className="text-[#1D4ED8] hover:underline"
            >
              {t("DISPLAY_CAUSELIST_HEADING")}
            </Link>{" "}
            {t("CAN_I_JOIN_MY_HEARING_ONLINE_ANS_PART_2")}
          </p>
          <p>{t("CAN_I_JOIN_MY_HEARING_ONLINE_ANS_PART_3")}</p>
        </div>
      ),
    },
    {
      id: 4,
      question: t("WHAT_DOCUMENTS_ARE_REQUIRED_FOR_E_FILING"),
      answer: (
        <div className="space-y-6 text-[#334155]">
          <p className="mb-4">
            {t("WHAT_DOCUMENTS_ARE_REQUIRED_FOR_E_FILING_ANS_LIST")}
          </p>
          <ol className="list-decimal pl-8 space-y-4">
            <li>
              <span className="font-bold">
                {t("DOCUMENTS_LIST_PROOF_OF_IDENTITY")}
              </span>{" "}
              {t("DOCUMENTS_LIST_PROOF_OF_IDENTITY_DESCRIPTION")}
            </li>
            <li>
              <span className="font-bold">
                {t("DOCUMENTS_LIST_DISHONORED_CHEQUE")}
              </span>{" "}
              {t("DOCUMENTS_LIST_DISHONORED_CHEQUE_DESCRIPTION")}
            </li>
            <li>
              <span className="font-bold">
                {t("DOCUMENTS_LIST_CHEQUE_RETURN_MEMO")}
              </span>{" "}
              {t("DOCUMENTS_LIST_CHEQUE_RETURN_MEMO_DESCRIPTION")}
            </li>
            <li>
              <span className="font-bold">
                {t("DOCUMENTS_LIST_LEGAL_DEMAND_NOTICE")}
              </span>{" "}
              {t("DOCUMENTS_LIST_LEGAL_DEMAND_NOTICE_DESCRIPTION")}
            </li>
            <li>
              <span className="font-bold">
                {t("DOCUMENTS_LIST_POSTAL_ACKNOWLEDGEMENT_ISSUE")}
              </span>{" "}
              {t("DOCUMENTS_LIST_POSTAL_ACKNOWLEDGEMENT_ISSUE_DESCRIPTION")}
            </li>
            <li>
              <span className="font-bold">
                {t("DOCUMENTS_LIST_POSTAL_ACKNOWLEDGEMENT_DELIVERY")}
              </span>{" "}
              {t("DOCUMENTS_LIST_POSTAL_ACKNOWLEDGEMENT_DELIVERY_DESCRIPTION")}
            </li>
            <li>
              <span className="font-bold">{t("DOCUMENTS_LIST_AFFIDAVIT")}</span>{" "}
              {t("DOCUMENTS_LIST_AFFIDAVIT_DESCRIPTION")}
            </li>
            <li>
              <span className="font-bold">
                {t("DOCUMENTS_LIST_OTHER_DOCUMENT")}
              </span>{" "}
              {t("DOCUMENTS_LIST_OTHER_DOCUMENT_DESCRIPTION")}
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: 5,
      question: t("WHAT_DOCUMENTS_ARE_REQUIRED_FOR_BAIL"),
      answer: (
        <div className="space-y-6 text-[#334155]">
          <p className="mb-4">
            {t("WHAT_DOCUMENTS_ARE_REQUIRED_FOR_BAIL_ANS_LIST")}
          </p>
          <ol className="list-decimal pl-8 space-y-4">
            <li>{t("WHAT_DOCUMENTS_ARE_REQUIRED_FOR_BAIL_ANS_LIST_1")}</li>
            <li>{t("WHAT_DOCUMENTS_ARE_REQUIRED_FOR_BAIL_ANS_LIST_2")}</li>
            <li>{t("WHAT_DOCUMENTS_ARE_REQUIRED_FOR_BAIL_ANS_LIST_3")}</li>
            <li>{t("WHAT_DOCUMENTS_ARE_REQUIRED_FOR_BAIL_ANS_LIST_4")}</li>
            <li>{t("WHAT_DOCUMENTS_ARE_REQUIRED_FOR_BAIL_ANS_LIST_5")}</li>
            <li>{t("WHAT_DOCUMENTS_ARE_REQUIRED_FOR_BAIL_ANS_LIST_6")}</li>
          </ol>
        </div>
      ),
    },
    {
      id: 6,
      question: t(
        "ARE_THERE_VIDEOS_OR_GUIDES_TO_HELP_ME_UNDERSTAND_HOW_TO_USE_THE_PLATFORM"
      ),
      answer: (
        <div className="space-y-6 text-[#334155]">
          <p>
            {t(
              "ARE_THERE_VIDEOS_OR_GUIDES_TO_HELP_ME_UNDERSTAND_HOW_TO_USE_THE_PLATFORM_ANS_PART_1"
            )}
          </p>
          <p>
            {t(
              "ARE_THERE_VIDEOS_OR_GUIDES_TO_HELP_ME_UNDERSTAND_HOW_TO_USE_THE_PLATFORM_ANS_PART_2"
            )}
          </p>
          <ol className="list-decimal pl-8 space-y-4">
            <li>
              {t(
                "ARE_THERE_VIDEOS_OR_GUIDES_TO_HELP_ME_UNDERSTAND_HOW_TO_USE_THE_PLATFORM_ANS_PART_3"
              )}
              <Link
                href="https://drive.google.com/file/d/1j4mIw0K2F8m_urJE-zbu-oeluiOL-8Pg/view?usp=sharing"
                className="text-[#1D4ED8] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("LINK")}
              </Link>
            </li>
            <li>
              {t(
                "ARE_THERE_VIDEOS_OR_GUIDES_TO_HELP_ME_UNDERSTAND_HOW_TO_USE_THE_PLATFORM_ANS_PART_4"
              )}
              <Link
                href="/video-tutorials"
                className="text-[#1D4ED8] hover:underline"
              >
                {t("LINK")}
              </Link>
            </li>
          </ol>
        </div>
      ),
    },
  ];

  return (
    <section
      className={`w-full bg-[#F0FDFA] ${isMobile ? "pt-8 pb-16" : "pt-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] pb-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)]"}`}
    >
      <div className="px-6 bg-[white]]">
        <div className="flex center justify-center">
          <h2
            className={`pb-2 font-libre font-normal text-center text-[#3A3A3A] border-b border-b-[#CBD5E1] ${isMobile ? "px-12 text-[32px] leading-[42px] max-w-[90%] mb-12" : "px-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] text-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] leading-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] mb-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)]"}`}
            style={
              {
                WebkitTextStrokeWidth: "0.5px",
              } as React.CSSProperties
            }
          >
            {t("FREQUENTLY_ASKED_QUESTIONS")}
          </h2>
        </div>
        <div className={`mx-auto ${isMobile ? "max-w-[90%]" : "max-w-[60%]"}`}>
          {questions.map((q) => (
            <Question
              key={q.id}
              id={q.id}
              question={q.question}
              answer={q.answer}
              isOpen={openQuestionId === q.id}
              onToggle={() => handleQuestionToggle(q.id)}
              setQuestionRef={(el, id) => (questionsRef.current[id] = el)}
              isMobile={isMobile}
            />
          ))}
        </div>
        <div
          className={`flex justify-center ${isMobile ? "mt-12" : "mt-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)]"}`}
        >
          <button
            className={`flex flex-row items-center justify-center px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] ${isMobile ? "gap-[12px]" : "gap-[clamp(7.73px,calc(7.73px+((12-7.73)*((100vw-1200px)/662))),12px)]"} bg-white border border-[#0F766E] rounded-[12px] ${isMobile ? "h-[40px]" : "h-[clamp(44.48px,calc(44.48px+((69-44.48)*((100vw-1200px)/662))),69px)]"}`}
            onClick={() => router.push("/help-resources")}
          >
            {isMobile ? (
              <svgIcons.OpenInNewTabIcon width="16" />
            ) : (
              <div className="w-[clamp(19.32px,calc(19.32px+((30-19.32)*((100vw-1200px)/662))),30px)] h-auto">
                <svgIcons.OpenInNewTabIcon width="100%" />
              </div>
            )}
            <span
              className={`font-roboto font-medium tracking-[-0.56px] text-center text-[#0F766E] ${isMobile ? "h-[24px] leading-[24px] text-[16px]" : "h-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] leading-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] text-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)]"}`}
            >
              {t("VIEW_HELP_RESOURCES")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuestionsSection;
