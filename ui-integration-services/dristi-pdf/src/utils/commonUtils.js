const { search_hrms, search_mdms } = require("../api");
const { handleApiCall } = require("./handleApiCall");
const { renderError } = require("./renderError");

async function getCourtAndJudgeDetails(
  res,
  tenantId,
  employeeType,
  courtId,
  requestInfo,
) {
  const resHrms = await handleApiCall(
    res,
    () => search_hrms(tenantId, employeeType, courtId, requestInfo),
    "Failed to query HRMS service",
  );

  const resMdms = await handleApiCall(
    res,
    () =>
      search_mdms(courtId, "common-masters.Court_Rooms", tenantId, requestInfo),
    "Failed to query MDMS service for court room",
  );
  const mdmsCourtRoom = resMdms?.data?.mdms[0]?.data;
  if (!mdmsCourtRoom) {
    renderError(res, "Court room MDMS master not found", 404);
  }

  const employee = resHrms.data.Employees.find(({ assignments }) =>
    assignments.some(
      ({ courtEstablishment, courtroom, fromDate, toDate }) =>
        mdmsCourtRoom.establishment === courtEstablishment &&
        courtroom === courtId &&
        fromDate <= Date.now() &&
        (toDate === null || toDate > Date.now()),
    ),
  );

  if (!employee) {
    renderError(res, "Employee not found", 404);
  }

  const assignment = employee.assignments.find(
    (assignment) => assignment.courtroom === courtId,
  );

  const responseMdms = await handleApiCall(
    res,
    () =>
      search_mdms(
        assignment.designation,
        "common-masters.Designation",
        tenantId,
        requestInfo,
      ),
    "Failed to query MDMS service for Designation",
  );
  const mdmsDesignation = responseMdms?.data?.mdms[0]?.data;
  if (!mdmsCourtRoom) {
    renderError(res, "Designation MDMS master not found", 404);
  }

  return {
    mdmsCourtRoom: {
      name: "Before The " + mdmsCourtRoom.name,
      courtName: mdmsCourtRoom.name,
      place:
        assignment.district.charAt(0).toUpperCase() +
        assignment.district.slice(1).toLowerCase(),
      state: "Kerala",
      orderHeading: "Before The " + mdmsCourtRoom.name,
      nameWithIn: "In the " + mdmsCourtRoom.name,
    },
    judgeDetails: {
      name: employee.user.name,
      judgeSignature: "Signature",
      courtSeal: "Court Seal",
      designation: mdmsDesignation.name,
      judgeDesignation: mdmsCourtRoom.name,
    },
  };
}

function getSelectedTitles(data, messagesMap) {
  const titles = [];

  const localizeTitle = (title) => {
    const match = title?.trim().match(/^(.*?)\s+(\d+)$/);
    if (match) {
      const baseTitle = match[1];
      const number = match[2];
      const translatedBase = messagesMap[baseTitle] || baseTitle;
      return `${translatedBase} ${number}`;
    }
    return messagesMap[title] || title;
  };

  const traverse = (items, parentTitle) => {
    items?.forEach((item) => {
      if (item.children?.length) {
        traverse(item.children, item.title);
      } else if (item.title) {
        const translatedTitle = localizeTitle(item.title);

        const excludedParentTitles = [
          "INITIAL_FILINGS",
          "AFFIDAVITS_PDF",
          "VAKALATS",
          "ADDITIONAL_FILINGS",
          "MEDIATION",
          "PLEA",
          "S351_EXAMINATION",
          "OBJECTION_APPLICATION_HEADING",
          "NOTICE",
          "WARRANT",
          "SUMMONS",
          "PAYMENT_RECEIPT_CASE_PDF",
        ];
        if (parentTitle && !excludedParentTitles.includes(parentTitle)) {
          const translatedParent = localizeTitle(parentTitle);
          titles.push(`${translatedTitle} - ${translatedParent}`);
        } else {
          titles.push(translatedTitle);
        }
      }
    });
  };

  traverse(data, null);
  return titles;
}

function transformCaseDataForFetching(caseDetails, keys) {
  const keyList = Array.isArray(keys) ? keys : [keys];
  let updatedCaseData = structuredClone(caseDetails || {});

  for (const key of keyList) {
    if (
      key === "complainantDetails" &&
      updatedCaseData?.litigants?.filter((lit) =>
        lit?.partyType?.includes("complainant"),
      )?.length > 0
    ) {
      updatedCaseData.additionalDetails = {
        ...(updatedCaseData?.additionalDetails || {}),
      };

      const complainantLitigants = updatedCaseData?.litigants?.filter(
        (litigant) => litigant?.partyType?.includes("complainant"),
      );

      const formdata = complainantLitigants?.map((litigant, index) => {
        const poaHolder = updatedCaseData?.poaHolders?.find((poa) =>
          poa?.representingLitigants?.some(
            (lit) => lit?.individualId === litigant?.individualId,
          ),
        );

        const complainantIdProof = litigant?.documents?.find(
          (doc) => doc?.documentType === "COMPLAINANT_ID_PROOF",
        );
        const companyProof = litigant?.documents?.find(
          (doc) => doc?.documentType === "case.authorizationproof.complainant",
        );
        const poaIdProof = poaHolder?.documents?.find(
          (doc) => doc?.documentType === "POA_COMPLAINANT_ID_PROOF",
        );
        const representingLitigant = poaHolder?.representingLitigants?.find(
          (lit) => lit?.individualId === litigant?.individualId,
        );
        const poaAuthorizationProof =
          representingLitigant?.documents?.find(
            (doc) => doc?.documentType === "POA_AUTHORIZATION_DOCUMENT",
          ) || null;

        const isRepresentative =
          litigant?.complainantType?.code === "REPRESENTATIVE";

        // Helper function to extract address fields
        const extractAddress = (
          address,
          includeCoordinates = true,
          includeIsCurrAddrSame = false,
        ) => {
          if (!address) return null;
          const result = {
            pincode: address?.pincode,
            city: address?.city,
            district: address?.district,
            locality: address?.locality,
            state: address?.state,
          };
          if (includeCoordinates) {
            result.coordinates = address?.coordinates;
          }
          if (includeIsCurrAddrSame) {
            result.isCurrAddrSame = address?.isCurrAddrSame;
          }
          return result;
        };

        // Helper function to map document
        const mapDocument = (doc) =>
          doc
            ? {
                fileName: doc?.fileName,
                fileStore: doc?.fileStore,
                documentName: doc?.documentName,
                documentType: doc?.documentType,
              }
            : null;

        const addressDetails = extractAddress(litigant?.permanentAddress);
        const addressDetailsSelect = extractAddress(
          litigant?.permanentAddress,
          false,
        );
        const currentAddressDetails = extractAddress(
          litigant?.currentAddress,
          true,
          true,
        );
        const currentAddressDetailsSelect = extractAddress(
          litigant?.currentAddress,
          false,
        );
        const companyAddress = extractAddress(litigant?.companyAddress, false);
        const poaAddress = extractAddress(poaHolder?.address);
        const poaAddressSelect = extractAddress(poaHolder?.address, false);

        const data = {
          firstName: litigant?.firstName,
          middleName: litigant?.middleName,
          lastName: litigant?.lastName,
          complainantAge: litigant?.age,
          complainantType: litigant?.complainantType,
          complainantTypeOfEntity: litigant?.complainantTypeOfEntity,
          transferredPOA: litigant?.transferredPOA,
          complainantVerification: {
            mobileNumber: litigant?.mobileNumber?.[0],
            isUserVerified: true,
            individualDetails: {
              individualId: litigant?.individualId,
              userUuid: litigant?.additionalDetails?.uuid,
              addressDetails: isRepresentative
                ? companyAddress
                : addressDetails,
              "addressDetails-select": isRepresentative
                ? companyAddress
                : addressDetailsSelect,
              currentAddressDetails: isRepresentative
                ? companyAddress
                : currentAddressDetails,
              "currentAddressDetails-select": isRepresentative
                ? companyAddress
                : currentAddressDetailsSelect,
              document: complainantIdProof
                ? [mapDocument(complainantIdProof)]
                : null,
            },
          },
          complainantId: { complainantId: true },
          // For INDIVIDUAL type - include addresses at top level
          ...(!isRepresentative && {
            addressDetails,
            "addressDetails-select": addressDetailsSelect,
            currentAddressDetails,
            "currentAddressDetails-select": currentAddressDetailsSelect,
          }),
          // For REPRESENTATIVE type - include company details
          ...(isRepresentative && {
            complainantCompanyName: litigant?.companyName,
            complainantDesignation: litigant?.designation,
            addressCompanyDetails: companyAddress,
            "addressCompanyDetails-select": companyAddress,
            companyDetailsUpload: companyProof
              ? [mapDocument(companyProof)]
              : [],
          }),
          // POA holder details
          ...(poaHolder && {
            poaFirstName: poaHolder?.firstName,
            poaMiddleName: poaHolder?.middleName,
            poaLastName: poaHolder?.lastName,
            poaAge: poaHolder?.age,
            poaAddressDetails: poaAddress,
            "poaAddressDetails-select": poaAddressSelect,
            poaVerification: {
              mobileNumber: poaHolder?.mobileNumber,
              isUserVerified: true,
              individualDetails: {
                individualId: poaHolder?.individualId,
                userUuid: poaHolder?.additionalDetails?.uuid,
                poaAddressDetails: poaAddress,
                "poaAddressDetails-select": poaAddressSelect,
                document: poaIdProof ? [mapDocument(poaIdProof)] : null,
              },
            },
            poaComplainantId: { poaComplainantId: true },
            poaAuthorizationDocument: {
              poaDocument: mapDocument(poaAuthorizationProof),
            },
          }),
        };

        return {
          data,
          isenabled: true,
          displayindex: index,
          isFormCompleted: true,
        };
      });

      updatedCaseData.additionalDetails["complainantDetails"] = {
        formdata,
        isCompleted: true,
      };
    }
  }

  return updatedCaseData;
}

function getPartyType(witnessType) {
  if (witnessType?.includes("PW")) {
    return "Prosecution";
  } else if (witnessType?.includes("DW")) {
    return "Defence";
  } else {
    return "Court";
  }
}

module.exports = {
  getCourtAndJudgeDetails,
  getPartyType,
  getSelectedTitles,
  transformCaseDataForFetching,
};
