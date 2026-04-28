const mdmsV1Path = window?.globalConfigs?.getConfig("MDMS_V1_CONTEXT_PATH") || "egov-mdms-service";
const mdmsV2Path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
const Urls = {
  MDMS_V2:`/${mdmsV2Path}/v1/_search`,
  MDMS: `/${mdmsV1Path}/v1/_search`,
  localization: `/localization/messages/v1/_search`,
};

export default Urls;
