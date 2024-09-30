import DashboardCard from "../../../components/basic/DashboardCard.tsx";
import { Box, Grid, Link, Tooltip, Typography } from "@mui/material";
import { Names } from "../../../api/common/dataNames.ts";
import {
  CustomCloseIcon,
  CustomDoneIcon,
} from "../../../components/icons/CustomIcons.ts";
import CustomReagentTooltip from "../../../components/basic/HtmlTooltip";
import { DataProviders } from "../../../api/dataProviders/DataProvider.ts";
import { ReagentInterface } from "../../../api/interfaces/reagent.ts";
import { getSafetyDataSheet, getSafetyInstruction } from "../../../api/dataProviders/dataProviders.ts";

function ReagentGeneralInfo(
  reagent: ReagentInterface,
  isLoading: boolean,
  title?: string,
) {
  const content = reagent ? (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      {title && <Typography variant="h4">{title}</Typography>}
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.id}: </b> {reagent.id || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.name}: </b> {reagent.name || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.catalog_no}: </b> {reagent.catalog_no || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.producer}: </b>
        <CustomReagentTooltip
          type="producer"
          size={5}
          item={reagent.producer}
          getDetails={DataProviders.PRODUCERS.getItem}
        />
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.purity_quality}: </b> {reagent.purity_quality?.repr || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.concentration}: </b> {reagent.concentration?.repr || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.type}: </b> {reagent.type?.repr || "-"}
      </Typography>
      <Grid container spacing={0.25}>
        <Typography variant="body2" gutterBottom component="div">
          <b>{Names.hazard_statements}: </b>
        </Typography>
        {reagent.hazard_statements?.map(
          (item: { id: number; repr: string }) =>
            item && (
              <Grid item key={item?.id} style={{ cursor: "pointer" }}>
                <CustomReagentTooltip
                  type="H"
                  size={5}
                  item={item}
                  getDetails={DataProviders.HAZARD_STATEMENTS.getItem}
                />
              </Grid>
            ),
        )}
      </Grid>
      <Grid container spacing={0.25}>
        <Typography variant="body2" gutterBottom component="div">
          <b>{Names.precautionary_statements}: </b>
        </Typography>

        {reagent.precautionary_statements?.map(
          (item: { id: number; repr: string }) =>
            item && (
              <Grid item key={item?.id} style={{ cursor: "pointer" }}>
                <CustomReagentTooltip
                  type="P"
                  size={5}
                  item={item}
                  getDetails={DataProviders.PRECAUTIONARY_STATEMENT.getItem}
                />
              </Grid>
            ),
        )}
      </Grid>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.safety_data_sheet}: </b>{" "}
        <Link onClick={async () => {
            window.open(
              (await getSafetyDataSheet(reagent.safety_data_sheet?.id)).safety_data_sheet,
              "_blank",
            );
          }} target="_blank">
                {reagent.safety_data_sheet?.repr}
                {" "}
          {Names.preview}
        </Link>
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.safety_instruction}: </b>{" "}
        <Link onClick={async () => {
            window.open(
              (await getSafetyInstruction(reagent.safety_instruction?.id)).safety_instruction,
              "_blank",
            );
          }} target="_blank">
                {reagent.safety_instruction?.repr}
                {" "}
          {Names.preview}
        </Link>
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.storage_conditions}: </b>
        <ul>
          {reagent.storage_conditions?.map(
            (item: { id: number; repr: string }) => (
              <li key={item?.id}>{item?.repr}</li>
            ),
          )}
        </ul>
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.volume}: </b> {reagent.volume || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.unit}: </b> {reagent.unit?.repr || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.cas_no}: </b> {reagent.cas_no || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.kit_contents}: </b> {reagent.kit_contents || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.other_info}: </b> {reagent.other_info || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.is_validated_by_admin}: </b>{" "}
        {reagent.is_validated_by_admin ? (
          <CustomDoneIcon />
        ) : (
          <CustomCloseIcon />
        )}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.is_usage_record_required}: </b>{" "}
        {reagent.is_usage_record_required ? (
          <CustomDoneIcon />
        ) : (
          <CustomCloseIcon />
        )}
      </Typography>
    </Box>
  ) : (
    <></>
  );
  return DashboardCard({
    title: Names.general_info,
    isLoading,
    content,
  });
}

export default ReagentGeneralInfo;
