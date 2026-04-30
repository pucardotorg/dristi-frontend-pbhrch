const axios = require("axios");
const config = require("../config/config");

exports.generateComplaintPDF = async (data, tenantId) => {
  const response = await axios.post(
    `${config.pdfServiceUrl}/pdf-service/v1/_createnosave?key=complainant-case-efiling&tenantId=${tenantId}`,
    data,
    {
      responseType: "arraybuffer",
    },
  );
  return response.data;
};
