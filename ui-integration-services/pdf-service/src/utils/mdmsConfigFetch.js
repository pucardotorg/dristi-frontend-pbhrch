import axios from "axios";
import envVariables from "../EnvironmentVariables";
import logger from "../config/logger";

/**
 * Extract the state-level tenantId (first segment before '.').
 * e.g. "kl.ernakulam" -> "kl"
 */
const getStateTenantId = (tenantId) => {
  if (!tenantId) return tenantId;
  return String(tenantId).split(".")[0];
};

/**
 * Fetch PDF data-config and format-config for a given key from MDMS v2.
 *
 * @param {string} key - The PDF config key (e.g. "application-generic")
 * @param {string} tenantId - tenantId from request; state-level is derived from it
 * @param {object} requestInfo - RequestInfo from the incoming request
 * @returns {{ dataConfig: object, formatConfig: object }}
 */
export const fetchPdfConfigFromMdms = async (key, tenantId, requestInfo) => {
  const mdmsUrl =
    envVariables.EGOV_MDMS_HOST + envVariables.EGOV_MDMS_V2_SEARCH_ENDPOINT;
  const stateTenantId = getStateTenantId(tenantId);

  const payload = {
    MdmsCriteria: {
      tenantId: stateTenantId,
      schemaCode: envVariables.PDF_MDMS_SCHEMA_CODE,
      limit: 500,
      offset: 0,
      filters: { key },
    },
    RequestInfo: requestInfo || {},
  };

  logger.info("Fetching PDF config from MDMS", {
    key,
    tenantId: stateTenantId,
    url: mdmsUrl,
  });

  let response;
  try {
    response = await axios.post(mdmsUrl, payload);
  } catch (err) {
    logger.error("MDMS call failed", {
      key,
      tenantId: stateTenantId,
      error: err.message,
    });
    throw new Error(
      `Failed to fetch PDF config from MDMS for key '${key}': ${err.message}`
    );
  }

  const mdms = response.data && response.data.mdms;
  if (!Array.isArray(mdms) || mdms.length === 0) {
    throw new Error(`No PDF config found in MDMS for key '${key}'`);
  }

  const data = mdms[0].data || {};
  const dataConfig = data["data-config"];
  const formatConfigWrapper = data["format-config"];
  const formatConfig = formatConfigWrapper && formatConfigWrapper.config;

  if (!dataConfig || !formatConfig) {
    throw new Error(
      `Incomplete PDF config in MDMS for key '${key}': missing data-config or format-config`
    );
  }

  logger.info("Loaded PDF config from MDMS", { key, tenantId: stateTenantId });
  return { dataConfig, formatConfig };
};
