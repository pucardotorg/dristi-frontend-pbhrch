import { useCallback, useMemo } from "react";
import { eSignService } from "../services/eSignService";
import type { AuthData } from "../types";

interface SignStatus {
  name: string;
  isSigned: boolean;
}

/**
 * useESignApi
 *
 * Provides handleEsign and checkSignStatus utilities.
 * Uses our own /api/esign Next.js route instead of Digit.DRISTIService.
 */
const useESignApi = () => {
  const tenantId = localStorage.getItem("tenant-id");

  const esignUrl = window?.globalConfigs?.getConfig("ESIGN_URL") || "https://es-staging.cdac.in/esignlevel2/2.1/form/signdoc";

  // Read session sign-status once on mount
  const parsedObj: SignStatus[] = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("signStatus") ?? "null") ?? [];
    } catch {
      return [];
    }
  }, []);

  /**
   * Initiates the e-sign flow:
   * 1. Saves sign intent to sessionStorage
   * 2. Calls backend via /api/esign
   * 3. Submits the CDAC form to redirect the user to the e-sign portal
   */
  const handleEsign = useCallback(
    async (
      name: string,
      pageModule: string,
      fileStoreId: string,
      authData: AuthData,
      signPlaceHolder?: string
    ): Promise<boolean> => {
      try {
        const newSignStatuses: SignStatus[] = [
          ...parsedObj,
          { name, isSigned: true },
        ];
        sessionStorage.setItem("signStatus", JSON.stringify(newSignStatuses));

        // Call our own API service (no Digit.DRISTIService dependency)
        const eSignResponse = await eSignService({
          ESignParameter: {
            uidToken: "3456565",
            consent: "6564",
            authType: "6546",
            fileStoreId,
            tenantId: tenantId as string,
            pageModule,
            signPlaceHolder: signPlaceHolder ?? "EsIIIgNNN_PlAcEholDeR_keYY",
          },
          RequestInfo: {
            apiId: "Dristi",
            authToken: authData?.authToken,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userInfo: authData?.userInfo as any,
            msgId: `${Date.now()}|en_IN`,
            plainAccessRequest: {},
          },
        });

        if (eSignResponse) {
          // Persist return path so we can recover after redirect
          sessionStorage.setItem(
            "eSignWindowObject",
            JSON.stringify({
              path: window.location.pathname,
              param: window.location.search,
              isEsign: true,
            })
          );
          sessionStorage.setItem("esignProcess", "true");

          // Build and submit the POST form to CDAC e-sign portal
          const form = document.createElement("form");
          form.method = "POST";
          form.action = esignUrl;

          const addHidden = (key: string, value: string) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value;
            form.appendChild(input);
          };

          addHidden("eSignRequest", eSignResponse?.ESignForm?.eSignRequest ?? "");
          addHidden("aspTxnID", eSignResponse?.ESignForm?.aspTxnID ?? "");
          addHidden("Content-Type", "application/xml");

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
          return true; // redirect initiated
        }
        return false;
      } catch (error) {
        console.error("eSign API call failed:", error);
        return false;
      }
    },
    [parsedObj, tenantId, esignUrl]
  );

  /**
   * Call this (e.g. in a useEffect) after the user returns from the eSign
   * portal. The global _app.tsx interceptor has already written:
   *   - sessionStorage["isSignSuccess"] = "success" | "failed"
   *   - sessionStorage["esignFileStoreId"] = "<id>"
   *
   * Returns the fileStoreId returned by the eSign portal, if available.
   */
  const checkSignStatus = (
    name: string,
    setIsSigned: (value: boolean) => void
  ): string | null => {
    const isSignSuccess = sessionStorage.getItem("isSignSuccess");
    const returnedFileStoreId = sessionStorage.getItem("esignFileStoreId");
    if (!isSignSuccess) return null;

    try {
      const parsedESignObj: SignStatus[] =
        JSON.parse(sessionStorage.getItem("signStatus") ?? "null") ?? [];

      const matched = parsedESignObj.find(
        (obj) => obj.name === name && obj.isSigned === true
      );

      if (isSignSuccess === "success" && matched) {
        setIsSigned(true);
      }
    } catch {
      // Malformed session data — ignore
    }

    // Cleanup after 2 s so the status isn't re-applied on subsequent renders
    setTimeout(() => {
      localStorage.removeItem("signStatus");
      localStorage.removeItem("name");
      sessionStorage.removeItem("isSignSuccess");
      sessionStorage.removeItem("esignProcess");
      sessionStorage.removeItem("eSignWindowObject");
      sessionStorage.removeItem("esignFileStoreId");
    }, 2000);

    return returnedFileStoreId;
  };

  return { handleEsign, checkSignStatus };
};

export default useESignApi;
