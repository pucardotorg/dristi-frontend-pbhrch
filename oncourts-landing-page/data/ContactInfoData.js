import Link from "next/link";
import { APP_URLS } from "../lib/config";

export const contactInfoData = [
  {
    icon: "PhoneIcon",
    title: "HELPLINE_NUMBER",
    content: "047 - 42919099",
    href: "callto:oncourt@gmail.com",
  },
  {
    icon: "HelpDeskIcon",
    title: "",
    content: "IN_PERSON_HELPDESK",
    href: "https://www.google.com/maps/place/24x7+ON+courts/@8.8930404,76.5743017,18z/data=!4m14!1m7!3m6!1s0x3b05fd005949c8dd:0xc8708f4a9f300b5c!2s24x7+ON+courts!8m2!3d8.8930386!4d76.5751556!16s%2Fg%2F11x8qmk6s1!3m5!1s0x3b05fd005949c8dd:0xc8708f4a9f300b5c!8m2!3d8.8930386!4d76.5751556!16s%2Fg%2F11x8qmk6s1?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D",
  },
  {
    icon: "ClockIcon",
    title: "AVAILABILITY",
    content: "10:00 - 17:00 IST",
    subContent: "MONDAY_SATURDAY_EXCEPT",
  },
  {
    icon: "EmailIcon",
    title: "EMAIL",
    content: "oncourtkollam@keralacourts.in",
    href: "mailto:oncourtkollam@keralacourts.in",
  },
];

export const getFaqs = (t) => [
  {
    question: t(
      "HOW_CAN_I_CHECK_THE_PROCEEDINGS_OF_THE_LAST_HEARING_AND_THE_NEXT_HEARING_DATE"
    ),
    answer: (
      <div>
        <p>
          {t("YOU_CAN_FIND_THESE_DETAILS_IN_THE")}{" "}
          <Link href="/search" className="text-[#1D4ED8] underline">
            {t("CASE_SEARCH")}
          </Link>{" "}
          {t(
            "SECTION_UNDER_SERVICES_TAB_ON_COURT_WEBSITE_SEARCH_CASE_VIEW_DETAILS"
          )}
        </p>
      </div>
    ),
  },
  {
    question: t(
      "HOW_CAN_I_SEE_TASKS_I_NEED_TO_COMPLETE_FOR_MY_CASE_TO_MOVE_FORWARD"
    ),
    answer: (
      <p>
        {t("YOU_CAN_ACCESS_PENDING_TASKS_BY_LOGGING_INTO_PORTAL")}{" "}
        {t("NAVIGATING_TO_ALL_PENDING_TASKS_SECTION")}{" "}
        <Link href="/search" className="text-[#1D4ED8] underline">
          {t("CASE_SEARCH")}
        </Link>{" "}
        {t("SECTION_UNDER_SERVICES_TO_REVIEW_PENDING_PAYMENTS")}
      </p>
    ),
  },
  {
    question: t(
      "HOW_CAN_I_CHECK_IF_MY_CASES_ARE_SCHEDULED_FOR_HEARING_ON_A_SPECIFIC_DAY"
    ),
    answer: (
      <p>
        {t("YOU_CAN_USE_THE")}{" "}
        <Link href="/display-board" className="text-[#1D4ED8] underline">
          {t("DISPLAY_CAUSELIST_HEADING")}
        </Link>{" "}
        {t("TO_VIEW_ALL_CASES_LISTED_FOR_CHOSEN_DATE")}{" "}
        {t("ALTERNATIVELY_YOU_CAN_ACCESS_THE")}{" "}
        <Link href="/search" className="text-[#1D4ED8] underline">
          {t("CASE_SEARCH")}
        </Link>{" "}
        {t("SECTION_UNDER_SERVICES_TO_CHECK_NEXT_HEARING_DATES")}
      </p>
    ),
  },
  {
    question: t("CAN_I_JOIN_MY_HEARING_ONLINE"),
    answer: (
      <div>
        <p>
          {t("YES_YOU_CAN_JOIN_YOUR_HEARING_ONLINE")}{" "}
          <Link href="/display-board" className="text-[#1D4ED8] underline">
            {t("DISPLAY_CAUSELIST_HEADING")}
          </Link>{" "}
          {t("SECTION_OF_THE_WEBSITE")}
        </p>
        <p>{t("YOU_CAN_ALSO_USE_THE_TO_DISPLAY_BOARD")}</p>
      </div>
    ),
  },
  {
    question: t("WHAT_DOCUMENTS_ARE_REQUIRED_FOR_E_FILING"),
    answer: (
      <div>
        <p>{t("LIST_OF_DOCUMENTS_REQUIRED_FOR_E_FILING")}</p>
        <ol className="list-decimal pl-6 mt-2 space-y-1">
          <li>
            <span className="font-semibold text-[#3A3A3A]">
              {t("PROOF_OF_IDENTITY")}
            </span>{" "}
            <span className="font-normal">{t("ID_DOCUMENTS_LIST")}</span>
          </li>
          <li>
            <span className="font-semibold text-[#3A3A3A]">
              {t("DISHONORED_CHEQUE")}
            </span>{" "}
            <span className="font-normal">
              {t("DISHONORED_CHEQUE_DESCRIPTION")}
            </span>
          </li>
          <li>
            <span className="font-semibold text-[#3A3A3A]">
              {t("CHEQUE_RETURN_MEMO")}
            </span>{" "}
            <span className="font-normal">
              {t("CHEQUE_RETURN_MEMO_DESCRIPTION")}
            </span>
          </li>
          <li>
            <span className="font-semibold text-[#3A3A3A]">
              {t("LEGAL_DEMAND_NOTICE")}
            </span>{" "}
            <span className="font-normal">
              {t("LEGAL_DEMAND_NOTICE_DESCRIPTION")}
            </span>
          </li>
          <li>
            <span className="font-semibold text-[#3A3A3A]">
              {t("POSTAL_ACKNOWLEDGEMENT_ISSUE")}
            </span>{" "}
            <span className="font-normal">
              {t("POSTAL_ACKNOWLEDGEMENT_ISSUE_DESCRIPTION")}
            </span>
          </li>
          <li>
            <span className="font-semibold text-[#3A3A3A]">
              {t("POSTAL_ACKNOWLEDGEMENT_DELIVERY")}
            </span>{" "}
            <span className="font-normal">
              {t("POSTAL_ACKNOWLEDGEMENT_DELIVERY_DESCRIPTION")}
            </span>
          </li>
          <li>
            <span className="font-semibold text-[#3A3A3A]">
              {t("AFFIDAVIT_UNDER_SECTION_223")}
            </span>{" "}
            <span className="font-normal">
              {t("AFFIDAVIT_UNDER_SECTION_223_DESCRIPTION")}
            </span>
          </li>
          <li>
            <span className="font-semibold text-[#3A3A3A]">
              {t("ANY_OTHER_DOCUMENT")}
            </span>{" "}
            <span className="font-normal">
              {t("ANY_OTHER_DOCUMENT_DESCRIPTION")}
            </span>
          </li>
        </ol>
      </div>
    ),
  },
  {
    question: t("WHAT_DOCUMENTS_ARE_REQUIRED_FOR_BAIL"),
    answer: (
      <div>
        <p>{t("LIST_OF_DOCUMENTS_REQUIRED_FOR_BAIL")}</p>
        <ol className="list-decimal pl-6 mt-2 space-y-1">
          <li>{t("BAIL_APPLICATION_SYSTEM_GENERATED")}</li>
          <li>{t("ID_PROOFS_FOR_SURETIES")}</li>
          <li>{t("TAX_RECEIPTS_FOR_SURETIES")}</li>
          <li>{t("AFFIDAVITS_FOR_SURETIES_SYSTEM_GENERATED")}</li>
          <li>{t("BAIL_BOND")}</li>
          <li>{t("ANY_OTHER_DOCUMENT_YOU_DEEM_NECESSARY")}</li>
        </ol>
      </div>
    ),
  },
  {
    question: t(
      "ARE_THERE_VIDEOS_OR_GUIDES_TO_HELP_ME_UNDERSTAND_HOW_TO_USE_THE_PLATFORM"
    ),
    answer: (
      <div>
        <p>{t("YES_YOU_CAN_ACCESS_STEP_BY_STEP_USER_GUIDES")}</p>
        <p className="mt-2">
          {t("THESE_RESOURCES_ARE_AVAILABLE_UNDER_SUPPORT_TAB")}
        </p>
        <div className="mt-2">
          <ol className="list-decimal pl-6 mt-2 space-y-1">
            <li>
              {t("USER_GUIDE_FOR_ADVOCATES_AND_CLERKS")}{" "}
              <Link
                href="https://drive.google.com/file/d/1j4mIw0K2F8m_urJE-zbu-oeluiOL-8Pg/view?usp=sharing"
                className="text-[#1D4ED8] hover:underline inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("LINK")}
              </Link>
            </li>
            <li>
              {t("VIDEO_TUTORIALS_FOR_ADVOCATES_AND_CLERKS")}{" "}
              <Link
                href="/video-tutorials"
                className="text-[#1D4ED8] hover:underline inline-block"
              >
                {t("LINK")}
              </Link>
            </li>
          </ol>
        </div>
      </div>
    ),
  },
  {
    question: t("WHERE_CAN_I_REPORT_AN_ISSUE_OR_REQUEST_FOR_SUPPORT_ONLINE"),
    answer: (
      <p>
        {t("YOU_CAN_USE_THE_24X7_ON_COURTS")}{" "}
        <Link
          href="https://forms.gle/uCSgGiqGiMQYjjgeA"
          className="text-[#1D4ED8] underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("SUPPORT_FORM")}
        </Link>{" "}
        {t("TO_REPORT_ANY_ISSUE_OR_REQUEST_A_FEATURE")}
      </p>
    ),
  },
  {
    question: t("WHERE_CAN_I_UPDATE_MY_EMAIL_ID_ON_THE_PORTAL"),
    answer: (
      <p>
        {t("TO_UPDATE_YOUR_EMAIL_ID")}{" "}
        <Link
          href={`${APP_URLS.CITIZEN_APP}`}
          className="text-[#1D4ED8] underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("LOG_IN")}
        </Link>{" "}
        {t(
          "TO_THE_PORTAL_AND_CLICK_THE_PROFILE_ICON_AT_THE_TOP_RIGHT_CORNER_OF_THE_HOMEPAGE"
        )}
      </p>
    ),
  },
  {
    question: t(
      "WHERE_SHOULD_I_DO_IF_I_ENCOUNTER_AN_ERROR_MESSAGE_ON_THE_WEBSITE"
    ),
    answer: (
      <div>
        <p>{t("YOU_CAN_ATTEMPT_TO_REFRESH_THE_PAGE")}</p>
        <p className="mt-2">
          {t(
            "IF_THE_PROBLEM_CONTINUES_YOU_CAN_CONTACT_THE_ON_COURT_HELPDESK_USING"
          )}
        </p>
        <p className="mt-2">
          {t("PHONE_SUPPORT_CALL_MONDAY_TO_SATURDAY_1000_AM_500_PM")}
        </p>
      </div>
    ),
  },
  {
    question: t("WHERE_IS_MY_DATA_PROTECTED_ON_THE_PLATFORM"),
    answer: (
      <p>
        {t(
          "ALL_PERSONAL_AND_CASE_RELATED_DATA_IS_SECURELY_STORED_AND_PROTECTED"
        )}
      </p>
    ),
  },
];
