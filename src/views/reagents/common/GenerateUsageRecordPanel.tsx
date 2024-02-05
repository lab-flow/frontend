import { Alert, AlertTitle, Link } from "@mui/material";

import { PersonalReagent } from "../../../api/interfaces/reagentInterfaces.ts";
import { getUsageRecord } from "../../../api/dataProviders/dataProviders.ts";
import { useContext } from "react";
import { APIAlertContext } from "../../../providers/alertProvider";
import { downloadPDF } from "../../../api/common/downloadPDF";

export const generateAndShowUsageRecord = async (id: number) => {
  const usageRecord = await getUsageRecord(id);
  const name =
    usageRecord?.headers["content-disposition"]
      ?.split("filename=")[1]
      .split(".")[0] || "karta_rozchodu";
  downloadPDF(usageRecord?.data, name);
};

function GenerateUsageRecordPanel(reagent: PersonalReagent) {
  const { id } = reagent;
  const { addAlert } = useContext(APIAlertContext);

  return (
    <Alert severity="error">
      <AlertTitle>Uwaga</AlertTitle>
      Brak karty rozchodu -{" "}
      <Link
        onClick={() =>
          generateAndShowUsageRecord(id)
            .then(() => {
              addAlert(
                "Karta rozchodu została pomyślnie wygenerowana",
                "success",
              );
            })
            .catch(() => {
              addAlert(
                "Wystąpił błąd podczas generowania karty rozchodu",
                "error",
              );
            })
        }
        style={{ cursor: "pointer" }} // Add this style
      >
        <strong>kliknij tutaj aby wygenerować</strong>
      </Link>
    </Alert>
  );
}

export default GenerateUsageRecordPanel;
