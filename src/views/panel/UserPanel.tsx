import { useMemo } from "react";
import FactoryIcon from "@mui/icons-material/Factory";
import ScaleIcon from "@mui/icons-material/Scale";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ScienceIcon from "@mui/icons-material/Science";
import { authenticationService } from "../../services/authenticationService.ts";
import BasePanel from "./BasePanel.tsx";
import Producers from "../producers/Producers";
import Units from "../units/Units";
import HazardStatements from "../hazard-statements/HazardStatements";
import ReagentTypes from "../reagent-types/ReagentTypes";
import StorageConditions from "../storage-conditions/StorageConditions";
import PuritiesQualities from "../purities-qualities/PuritiesQualities";
import PrecautionaryStatement from "../precautionary-statement/PrecautionaryStatement";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { Names } from "../../api/common/dataNames";
import CategoryIcon from "@mui/icons-material/Category";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import VerifiedIcon from "@mui/icons-material/Verified";
import ClpClassifications from "../clp-classifications/ClpClassifications";
import TextIcon from "../basic/TextIcon";
import Pictograms from "../pictograms/Pictograms";
import Concentrations from "../concentrations/Concentrations";
import ProjectProcedures from "../project-procedures/ProjectProcedures";
import PercentIcon from "@mui/icons-material/Percent";
import WarningIcon from "@mui/icons-material/Warning";
import {
  AllPersonalReagentsActualAdminView,
  AllPersonalReagentsActualUserView,
  AllPersonalReagentsArchiveAdminView,
  AllPersonalReagentsArchiveUserView,
} from "../reagents/personal/data-grid/PersonalReagentsDataGridViews";
import { ADMIN_ROLE, ROLE } from "../../api/enums/userRoles";
import ReagentRequestsMe from "../reagents/requests/ReagentRequestsMe";
import ReagentsGrid from "../reagents/general/ReagentsGrid";
import Laboratories from "../laboratory/Laboratories.tsx";

function UserPanel() {
  const { currentUserRoles } = authenticationService;

  const subNavBarItems = useMemo(() => {
    return [
      {
        name: Names.reagents,
        id: DataProviders.REAGENTS.endpoint,
        icon: <ScienceIcon />,
        component: <ReagentsGrid history={false} />,
        visible: true,
      },
      {
        name: Names.personal_reagents,
        id: DataProviders.PERSONAL_REAGENTS.endpoint,
        icon: <ScienceIcon />,
        component: currentUserRoles.some((r) =>
          [ROLE.PROCEDURE_MANAGER, ROLE.LAB_MANAGER, ADMIN_ROLE].includes(r),
        ) ? (
          <AllPersonalReagentsActualAdminView history={false} />
        ) : (
          <AllPersonalReagentsActualUserView />
        ),
        visible: true,
      },
      {
        name: Names.personal_reagents,
        id: `${DataProviders.PERSONAL_REAGENTS.endpoint}-archived`,
        icon: <ScienceIcon />,
        component: currentUserRoles.some((r) =>
          [ROLE.PROCEDURE_MANAGER, ROLE.LAB_MANAGER, ADMIN_ROLE].includes(r),
        ) ? (
          <AllPersonalReagentsArchiveAdminView />
        ) : (
          <AllPersonalReagentsArchiveUserView />
        ),
        visible: false,
      },
      {
        name: Names.reagent_passing,
        id: "reagents-passing",
        icon: <SwapHorizIcon />,
        component: <ReagentRequestsMe />,
        visible: true,
      },
      {
        name: Names.producers,
        id: DataProviders.PRODUCERS.endpoint,
        icon: <FactoryIcon />,
        component: <Producers history={false} />,
        visible: true,
        dividerBefore: true,
      },
      {
        name: Names.project_procedures,
        id: "projects-procedures",
        icon: <TextIcon text={"PP"} />,
        component: <ProjectProcedures history={false} />,
        visible: true,
      },
      {
        name: Names.reagent_types,
        id: DataProviders.REAGENT_TYPES.endpoint,
        icon: <CategoryIcon />,
        component: <ReagentTypes history={false} />,
        visible: true,
      },
      {
        name: Names.concentrations,
        id: DataProviders.CONCENTRATIONS.endpoint,
        icon: <PercentIcon />,
        component: <Concentrations history={false} />,
        visible: true,
      },
      {
        name: Names.units,
        id: DataProviders.UNITS.endpoint,
        icon: <ScaleIcon />,
        component: <Units history={false} />,
        visible: true,
      },
      {
        name: Names.storage_conditions,
        id: DataProviders.STORAGE_CONDITIONS.endpoint,
        icon: <ThermostatIcon />,
        component: <StorageConditions history={false} />,
        visible: true,
      },
      {
        name: Names.purities_qualities,
        id: DataProviders.PURITIES_QUALITIES.endpoint,
        icon: <VerifiedIcon />,
        component: <PuritiesQualities history={false} />,
        visible: true,
      },
      {
        name: Names.precautionary_statements,
        id: DataProviders.PRECAUTIONARY_STATEMENT.endpoint,
        icon: <TextIcon text="P" />,
        component: <PrecautionaryStatement history={false} />,
        visible: true,
        dividerBefore: true,
      },
      {
        name: Names.hazard_statements,
        id: DataProviders.HAZARD_STATEMENTS.endpoint,
        icon: <TextIcon text={"H"} />,
        component: <HazardStatements history={false} />,
        visible: true,
      },
      {
        name: Names.pictograms,
        id: DataProviders.PICTOGRAMS.endpoint,
        icon: <WarningIcon />,
        component: <Pictograms history={false} />,
        visible: true,
      },
      {
        name: Names.clp_classifications,
        id: DataProviders.CLP_CLASSIFICATIONS.endpoint,
        icon: <TextIcon text="CLP" />,
        component: <ClpClassifications history={false} />,
        visible: true,
      },
      {
        name: Names.laboratories,
        id: DataProviders.LABORATORIES.endpoint,
        icon: <TextIcon text="L" />,
        component: <Laboratories history={false} />,
        visible: true,
        dividerBefore: true,
      },
    ];
  }, [currentUserRoles]);

  return <BasePanel subNavBarItems={subNavBarItems} baseUrl="/user-panel/" />;
}

export default UserPanel;
