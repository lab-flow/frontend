import { SyntheticEvent, useState } from "react";
import { Names } from "../../api/common/dataNames";
import DashboardCard from "../../components/basic/DashboardCard";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UsersList from "../users/UsersList";
import ReagentsGrid from "../reagents/general/ReagentsGrid";
import { AllPersonalReagentsActualAdminView } from "../reagents/personal/data-grid/PersonalReagentsDataGridViews";
import Producers from "../producers/Producers";
import Units from "../units/Units";
import ReagentTypes from "../reagent-types/ReagentTypes";
import StorageConditions from "../storage-conditions/StorageConditions";
import PuritiesQualities from "../purities-qualities/PuritiesQualities";
import PrecautionaryStatement from "../precautionary-statement/PrecautionaryStatement";
import HazardStatements from "../hazard-statements/HazardStatements";
import ClpClassifications from "../clp-classifications/ClpClassifications";
import Pictograms from "../pictograms/Pictograms";
import Concentrations from "../concentrations/Concentrations";
import ProjectProcedures from "../project-procedures/ProjectProcedures";

function Logs() {
  const [expanded, setExpanded] = useState<string>();

  const handleChange =
    (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : undefined);
    };

  const logsComponents = {
    personal_reagents: AllPersonalReagentsActualAdminView({
      history: true,
      logsPage: true,
    }),
    producers: Producers({ history: true, logsPage: true }),
    users: UsersList({ history: true, logsPage: true }),
    units: Units({ history: true, logsPage: true }),
    reagent_types: ReagentTypes({ history: true, logsPage: true }),
    storage_conditions: StorageConditions({ history: true, logsPage: true }),
    purities_qualities: PuritiesQualities({ history: true, logsPage: true }),
    precautionary_statements: PrecautionaryStatement({
      history: true,
      logsPage: true,
    }),
    hazard_statements: HazardStatements({ history: true, logsPage: true }),
    reagents: ReagentsGrid({ history: true, logsPage: true }),
    clp_classifications: ClpClassifications({ history: true, logsPage: true }),
    pictograms: Pictograms({ history: true, logsPage: true }),
    concentrations: Concentrations({ history: true, logsPage: true }),
    project_procedures: ProjectProcedures({ history: true, logsPage: true }),
  };

  const content = (
    <>
      <Typography variant="h6" gutterBottom component="div">
        {Names.logs_desc}
      </Typography>
      <Box sx={{ m: 2 }} />
      {Object.entries(logsComponents).map(([key, value], index) => {
        const panelId = `panel-${key}`;
        return (
          <Accordion
            TransitionProps={{ unmountOnExit: true }}
            key={key}
            expanded={expanded === panelId}
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
            <AccordionDetails>{value}</AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );

  return <DashboardCard title={Names.logs} content={content} />;
}

export default Logs;
