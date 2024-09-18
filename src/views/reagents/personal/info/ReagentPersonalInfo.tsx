import DashboardCard from "../../../../components/basic/DashboardCard.tsx";
import { Box, Typography } from "@mui/material";
import { Names } from "../../../../api/common/dataNames.ts";
import {
  CustomCloseIcon,
  CustomDoneIcon,
} from "../../../../components/icons/CustomIcons.ts";
import CustomReagentTooltip from "../../../../components/basic/HtmlTooltip";
import { DataProviders } from "../../../../api/dataProviders/DataProvider.ts";
import { PersonalReagentInterface } from "../../../../api/interfaces/personalReagent.ts";

function ReagentPersonalInfo(
  reagent: PersonalReagentInterface | null,
  isLoading: boolean,
) {
  const content = reagent ? (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.project_procedure}: </b>
        {reagent.project_procedure ? (
          <CustomReagentTooltip
            type="project_procedure"
            item={reagent.project_procedure}
            getDetails={DataProviders.PROJECT_PROCEDURES.getItem}
          />
        ) : null}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.is_critical}: </b>{" "}
        {reagent.is_critical ? <CustomDoneIcon /> : <CustomCloseIcon />}
      </Typography>

      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.detailed_location}: </b> {reagent.detailed_location || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.disposal_utilization_date}: </b>{" "}
        {reagent.disposal_utilization_date || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.expiration_date}: </b> {reagent.expiration_date || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.receipt_purchase_date}: </b>{" "}
        {reagent.receipt_purchase_date || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.is_archived}: </b>{" "}
        {reagent.is_archived ? <CustomDoneIcon /> : <CustomCloseIcon />}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.is_usage_record_generated}: </b>{" "}
        {reagent.is_usage_record_generated ? (
          <CustomDoneIcon />
        ) : (
          <CustomCloseIcon />
        )}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.laboratory}: </b> {" "}
        {reagent?.laboratory?.repr}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.lot_no}: </b> {reagent.lot_no || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.main_owner}: </b>
        <CustomReagentTooltip
          type="main_owner"
          item={reagent.main_owner}
          getDetails={DataProviders.USERS.getItem}
        />
      </Typography>

      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.room}: </b> {reagent.room || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.user_comment}: </b> {reagent.user_comment || "-"}
      </Typography>
    </Box>
  ) : (
    <></>
  );

  return DashboardCard({
    title: "",
    isLoading,
    content,
  });
}

export default ReagentPersonalInfo;
