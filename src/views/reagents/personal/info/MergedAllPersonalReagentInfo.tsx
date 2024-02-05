import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Box, Card, Typography } from "@mui/material";

import { getPersonalReagentAllInfo } from "../../../../api/dataProviders/dataProviders.ts";
import ReagentGeneralInfo from "../../general/ReagentGeneralInfo.tsx";
import ReagentPersonalInfo from "./ReagentPersonalInfo.tsx";
import GenerateUsageRecordPanel from "../../common/GenerateUsageRecordPanel.tsx";
import theme from "../../../../theme.ts";

function MergedAllPersonalReagentInfo() {
  const { id } = useParams();

  const { data, isLoading } = useQuery("personalReagentAllInfo", () =>
    getPersonalReagentAllInfo(Number(id)),
  );

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
      }}
    >
      {data &&
        !data?.is_usage_record_generated &&
        data?.is_usage_record_required &&
        GenerateUsageRecordPanel(data)}
      <Card sx={{ padding: "10px" }}>
        <Typography variant="h4">{data?.name}</Typography>
      </Card>
      {ReagentGeneralInfo(data, isLoading)}
      {ReagentPersonalInfo(data, isLoading)}
      <br />
    </Box>
  );
}

export default MergedAllPersonalReagentInfo;
