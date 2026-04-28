import { CardText, Modal } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { CloseBtn, Heading } from "@egovernments/digit-ui-module-dristi/src/components/ModalComponents";

const LogoutDialog = ({ onSelect, onCancel, onDismiss }) => {
  const { t } = useTranslation();
  const mobileDeviceWidth = 780;
  const [isMobileView, setIsMobileView] = React.useState(window.innerWidth <= mobileDeviceWidth);
  const onResize = () => {
    if (window.innerWidth <= mobileDeviceWidth) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
  };
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      onResize();
    });
    return () => {
      window.addEventListener("resize", () => {
        onResize();
      });
    };
  });
  return isMobileView ? (
    <Modal
      popupStyles={{
        height: "174px",
        maxHeight: "174px",
        width: "324px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
      popupModuleActionBarStyles={{
        display: "flex",
        flex: 1,
        justifyContent: "flex-start",
        width: "100%",
        position: "absolute",
        left: 0,
        bottom: 0,
        padding: "18px",
      }}
      style={{
        flex: 1,
      }}
      popupModuleMianStyles={{
        padding: "18px",
      }}
      headerBarMain={<Heading label={t("CORE_LOGOUT_WEB_HEADER")} />}
      headerBarEnd={<CloseBtn onClick={onDismiss} isMobileView={isMobileView} />}
      actionCancelLabel={t("CORE_LOGOUT_CANCEL")}
      actionCancelOnSubmit={onCancel}
      actionSaveLabel={t("CORE_LOGOUT_WEB_YES")}
      actionSaveOnSubmit={onSelect}
      formId="modal-action"
    >
      <div>
        <CardText style={{ margin: 0 }}>{t("CORE_LOGOUT_WEB_CONFIRMATION_MESSAGE") + " "}</CardText>
      </div>
    </Modal>
  ) : (
    <Modal
      popupModuleMianStyles={{}}
      headerBarMain={<Heading label={t("CORE_LOGOUT_WEB_HEADER")} />}
      headerBarEnd={<CloseBtn onClick={onDismiss} isMobileView={false} />}
      actionCancelLabel={t("CORE_LOGOUT_CANCEL")}
      actionCancelOnSubmit={onCancel}
      actionSaveLabel={t("CORE_LOGOUT_WEB_YES")}
      actionSaveOnSubmit={onSelect}
      formId="modal-action"
    >
      <div>
        <CardText style={{ marginBottom: "54px", color: "#0B0C0C", textAlign: "center", fontSize: "24px" }}>
          {t("CORE_LOGOUT_WEB_CONFIRMATION_MESSAGE") + " "}
          <strong>{t("CORE_LOGOUT_MESSAGE")}</strong>
        </CardText>
      </div>
    </Modal>
  );
};
export default LogoutDialog;
