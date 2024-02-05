import { Names } from "../../api/common/dataNames";
import { Typography } from "@mui/material";
import DashboardCard from "../../components/basic/DashboardCard";

function ReportShow() {
  const content = (
    <Typography>Wybierz raport z listy po lewej stronie.</Typography>
  );
  return <DashboardCard title={Names.reports} content={content} />;
}

export default ReportShow;
