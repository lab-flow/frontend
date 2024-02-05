import { SyntheticEvent, useState } from "react";
import { useQuery } from "react-query";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { Names } from "../../api/common/dataNames";
import DashboardCard from "../../components/basic/DashboardCard";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import StatisticComponent from "./StatisticComponent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function StatisticsView() {
  const { data, isLoading } = useQuery("statisticsInfo", () =>
    DataProviders.STATISTICS.getItem().then((res) => res.data),
  );

  const [isExpanded, setIsExpanded] = useState<string>();

  const handleChange =
    (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setIsExpanded(isExpanded ? panel : undefined);
    };

  const content = (
    <>
      <Typography variant="h6" gutterBottom component="div">
        {Names.statistics_desc}
      </Typography>
      <Box sx={{ m: 2 }} />
      {!isLoading &&
        data &&
        Object.entries(data).map(([key, value], index) => {
          const panelId = `panel-${key}`;
          return (
            <Accordion
              key={key}
              expanded={isExpanded === panelId}
              onChange={handleChange(panelId)}
              sx={{ width: "100%", minHeight: "30px" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={panelId}
                id={panelId}
              >
                <Typography>
                  {index + 1}. {Names[key as keyof typeof Names] || key}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <StatisticComponent
                  title={key}
                  data={value as unknown as Array<object>}
                />
              </AccordionDetails>
            </Accordion>
          );
        })}
    </>
  );

  return (
    <DashboardCard
      title={Names.statistics}
      content={content}
      isLoading={isLoading}
    />
  );
}

export default StatisticsView;
