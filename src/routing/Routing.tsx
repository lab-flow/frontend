import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../views/Home";
import Layout from "../views/basic/Layout.tsx";

import "../styles/App.scss";
import NotFound from "../views/basic/NotFound.tsx";
import AdminPanel from "../views/panel/AdminPanel.tsx";
import AddPersonalReagent from "../views/reagents/personal/form/AddPersonalReagent.tsx";
import ReagentInfo from "../views/reagents/general/ReagentInfo.tsx";
import MergedAllPersonalReagentInfo from "../views/reagents/personal/info/MergedAllPersonalReagentInfo.tsx";
import Login from "../views/auth/Login.tsx";
import UserPanel from "../views/panel/UserPanel.tsx";
import AddReagent from "../views/reagents/general/AddReagent.tsx";
import { PrivateRoute } from "./PrivateRoute.tsx";
import { ADMIN_ROLE, ANY_ROLE_LIST, ROLE } from "../api/enums/userRoles";
import UserInfoView from "../views/users/UserInfoView.tsx";
import EditPersonalReagent from "../views/reagents/personal/form/EditPersonalReagent.tsx";
import {
  AllPersonalReagentsActualAdminView,
  PersonalReagentsMyActual,
  PersonalReagentsMyArchived,
} from "../views/reagents/personal/data-grid/PersonalReagentsDataGridViews.tsx";
import AddProducer from "../views/producers/AddProducer";
import EditProducer from "../views/producers/EditProducer";
import AddUnit from "../views/units/AddUnit";
import AddHazardStatement from "../views/hazard-statements/AddHazardStatement";
import AddUser from "../views/users/AddUser";
import EditUser from "../views/users/EditUser";
import EditReagent from "../views/reagents/general/EditReagent";
import EditHazard from "../views/hazard-statements/EditHazardStatement";
import AddReagentType from "../views/reagent-types/AddReagentType";
import AddStorageConditions from "../views/storage-conditions/AddStorageConditions";
import AddPurityQuality from "../views/purities-qualities/AddPurityQuality";
import AddPrecautionaryStatement from "../views/precautionary-statement/AddPrecautionaryStatement";
import { DataProviders } from "../api/dataProviders/DataProvider.ts";
import AddClpClassification from "../views/clp-classifications/AddClpClassification";
import AddProjectProcedure from "../views/project-procedures/AddProjectProcedure";
import AddConcentrations from "../views/concentrations/AddConcentrations";
import EditProjectProcedure from "../views/project-procedures/EditProjectProcedure";
import EditReagentType from "../views/reagent-types/EditReagentType";
import EditConcentrations from "../views/concentrations/EditConcentrations";
import EditUnit from "../views/units/EditUnit";
import EditStorageConditions from "../views/storage-conditions/EditStorageConditions";
import EditPurityQuality from "../views/purities-qualities/EditPurityQuality";
import EditPrecautionaryStatement from "../views/precautionary-statement/EditPrecautionaryStatement";
import EditPictograms from "../views/pictograms/EditPictograms";
import EditClpClassification from "../views/clp-classifications/EditClpClassification";
import ReagentsGrid from "../views/reagents/general/ReagentsGrid";
import WikiPanel from "../views/panel/WikiPanel";
import ReportsPanel from "../views/panel/ReportsPanel";
import StatisticsView from "../views/statistics/StatisticsView";
import Producers from "../views/producers/Producers";
import UsersList from "../views/users/UsersList";
import Units from "../views/units/Units";
import ReagentTypes from "../views/reagent-types/ReagentTypes";
import StorageConditions from "../views/storage-conditions/StorageConditions";
import PuritiesQualities from "../views/purities-qualities/PuritiesQualities";
import PrecautionaryStatement from "../views/precautionary-statement/PrecautionaryStatement";
import HazardStatements from "../views/hazard-statements/HazardStatements";
import ClpClassifications from "../views/clp-classifications/ClpClassifications";
import Pictograms from "../views/pictograms/Pictograms";
import Concentrations from "../views/concentrations/Concentrations";
import ProjectProcedures from "../views/project-procedures/ProjectProcedures";
import AddPictograms from "../views/pictograms/AddPictograms";

function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="wiki/:id" element={<WikiPanel />} />
          <Route
            path="reports/:id"
            element={
              <PrivateRoute
                component={ReportsPanel}
                roles={[ADMIN_ROLE, ROLE.PROCEDURE_MANAGER, ROLE.LAB_MANAGER]}
              />
            }
          />
          <Route
            path="statistics"
            element={
              <PrivateRoute component={StatisticsView} roles={ANY_ROLE_LIST} />
            }
          />
          <Route path="login" element={<Login />} />
          <Route
            path="user-info/:id"
            element={
              <PrivateRoute component={UserInfoView} roles={ANY_ROLE_LIST} />
            }
          />
          <Route
            path="personal-reagents/me"
            element={
              <PrivateRoute
                component={PersonalReagentsMyActual}
                roles={ANY_ROLE_LIST}
              />
            }
          />
          <Route
            path="personal-reagents/me/archived"
            element={
              <PrivateRoute
                component={PersonalReagentsMyArchived}
                roles={ANY_ROLE_LIST}
              />
            }
          />
          <Route
            path="user-panel/:id"
            element={
              <PrivateRoute component={UserPanel} roles={ANY_ROLE_LIST} />
            }
          />
          <Route
            path="reagents"
            element={
              <PrivateRoute component={ReagentsGrid} roles={ANY_ROLE_LIST} />
            }
          />
          <Route
            path="reagents/:id"
            element={
              <PrivateRoute component={ReagentInfo} roles={ANY_ROLE_LIST} />
            }
          />
          <Route
            path="reagents/:id/edit"
            element={
              <PrivateRoute
                component={EditReagent}
                roles={[ADMIN_ROLE, ROLE.PROCEDURE_MANAGER, ROLE.LAB_MANAGER]}
              />
            }
          />
          <Route
            path="personal-reagents/:id"
            element={
              <PrivateRoute
                component={MergedAllPersonalReagentInfo}
                roles={ANY_ROLE_LIST}
              />
            }
          />
          <Route
            path={`${DataProviders.PERSONAL_REAGENTS.endpoint}/new`}
            element={
              <PrivateRoute
                component={AddPersonalReagent}
                roles={ANY_ROLE_LIST}
              />
            }
          />
          <Route
            path={`${DataProviders.PERSONAL_REAGENTS.endpoint}/history`}
            element={
              <PrivateRoute
                component={() =>
                  AllPersonalReagentsActualAdminView({ history: true })
                }
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path="personal-reagents/:id/edit"
            element={
              <PrivateRoute
                component={EditPersonalReagent}
                roles={ANY_ROLE_LIST}
              />
            }
          />
          <Route
            path={`${DataProviders.PRODUCERS.endpoint}/new`}
            element={
              <PrivateRoute component={AddProducer} roles={ANY_ROLE_LIST} />
            }
          />
          <Route
            path={`${DataProviders.PRODUCERS.endpoint}/history`}
            element={
              <PrivateRoute
                component={() => Producers({ history: true })}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path="producers/:id/edit"
            element={
              <PrivateRoute
                component={EditProducer}
                roles={[ADMIN_ROLE, ROLE.PROCEDURE_MANAGER, ROLE.LAB_MANAGER]}
              />
            }
          />
          <Route
            path={`${DataProviders.USERS.endpoint}/new`}
            element={<PrivateRoute component={AddUser} roles={[ADMIN_ROLE]} />}
          />
          <Route
            path={`${DataProviders.USERS.endpoint}/history`}
            element={
              <PrivateRoute
                component={() => UsersList({ history: true })}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path="users/:id/edit"
            element={<PrivateRoute component={EditUser} roles={[ADMIN_ROLE]} />}
          />
          <Route
            path={`${DataProviders.UNITS.endpoint}/new`}
            element={<PrivateRoute component={AddUnit} roles={ANY_ROLE_LIST} />}
          />
          <Route
            path={`${DataProviders.UNITS.endpoint}/history`}
            element={
              <PrivateRoute
                component={() => Units({ history: true })}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.REAGENT_TYPES.endpoint}/new`}
            element={
              <PrivateRoute component={AddReagentType} roles={ANY_ROLE_LIST} />
            }
          />
          <Route
            path={`${DataProviders.REAGENT_TYPES.endpoint}/history`}
            element={
              <PrivateRoute
                component={() => ReagentTypes({ history: true })}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.STORAGE_CONDITIONS.endpoint}/new`}
            element={
              <PrivateRoute
                component={AddStorageConditions}
                roles={ANY_ROLE_LIST}
              />
            }
          />
          <Route
            path={`${DataProviders.STORAGE_CONDITIONS.endpoint}/history`}
            element={
              <PrivateRoute
                component={() => StorageConditions({ history: true })}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.PURITIES_QUALITIES.endpoint}/new`}
            element={
              <PrivateRoute
                component={AddPurityQuality}
                roles={ANY_ROLE_LIST}
              />
            }
          />
          <Route
            path={`${DataProviders.PURITIES_QUALITIES.endpoint}/history`}
            element={
              <PrivateRoute
                component={() => PuritiesQualities({ history: true })}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.PRECAUTIONARY_STATEMENT.endpoint}/new`}
            element={
              <PrivateRoute
                component={AddPrecautionaryStatement}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.PRECAUTIONARY_STATEMENT.endpoint}/history`}
            element={
              <PrivateRoute
                component={() => PrecautionaryStatement({ history: true })}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.HAZARD_STATEMENTS.endpoint}/new`}
            element={
              <PrivateRoute
                component={AddHazardStatement}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.HAZARD_STATEMENTS.endpoint}/history`}
            element={
              <PrivateRoute
                component={() => HazardStatements({ history: true })}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path="hazards/:id/edit"
            element={
              <PrivateRoute component={EditHazard} roles={[ADMIN_ROLE]} />
            }
          />
          <Route
            path="admin-panel/:id"
            element={
              <PrivateRoute
                component={AdminPanel}
                roles={[ADMIN_ROLE, ROLE.LAB_MANAGER]}
              />
            }
          />
          <Route
            path={`${DataProviders.REAGENTS.endpoint}/new`}
            element={
              <PrivateRoute component={AddReagent} roles={ANY_ROLE_LIST} />
            }
          />
          <Route
            path={`${DataProviders.REAGENTS.endpoint}/history`}
            element={
              <PrivateRoute
                component={() => ReagentsGrid({ history: true })}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.CLP_CLASSIFICATIONS.endpoint}/new`}
            element={
              <PrivateRoute
                component={AddClpClassification}
                roles={ANY_ROLE_LIST}
              />
            }
          />
          <Route
            path={`${DataProviders.CLP_CLASSIFICATIONS.endpoint}/history`}
            element={
              <PrivateRoute
                component={() => ClpClassifications({ history: true })}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.PICTOGRAMS.endpoint}/new`}
            element={
              <PrivateRoute component={AddPictograms} roles={[ADMIN_ROLE]} />
            }
          />
          <Route
            path={`${DataProviders.PICTOGRAMS.endpoint}/history`}
            element={
              <PrivateRoute
                component={() => Pictograms({ history: true })}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.CONCENTRATIONS.endpoint}/new`}
            element={
              <PrivateRoute
                component={AddConcentrations}
                roles={ANY_ROLE_LIST}
              />
            }
          />
          <Route
            path={`${DataProviders.CONCENTRATIONS.endpoint}/history`}
            element={
              <PrivateRoute
                component={() => Concentrations({ history: true })}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.PROJECT_PROCEDURES.endpoint}/new`}
            element={
              <PrivateRoute
                component={AddProjectProcedure}
                roles={[ADMIN_ROLE, ROLE.PROCEDURE_MANAGER, ROLE.LAB_MANAGER]}
              />
            }
          />
          <Route
            path={`${DataProviders.PROJECT_PROCEDURES.endpoint}/history`}
            element={
              <PrivateRoute
                component={() => ProjectProcedures({ history: true })}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.PROJECT_PROCEDURES.endpoint}/:id/edit`}
            element={
              <PrivateRoute
                component={EditProjectProcedure}
                roles={[ADMIN_ROLE, ROLE.PROCEDURE_MANAGER, ROLE.LAB_MANAGER]}
              />
            }
          />
          <Route
            path={`${DataProviders.REAGENT_TYPES.endpoint}/:id/edit`}
            element={
              <PrivateRoute component={EditReagentType} roles={[ADMIN_ROLE]} />
            }
          />
          <Route
            path={`${DataProviders.CONCENTRATIONS.endpoint}/:id/edit`}
            element={
              <PrivateRoute
                component={EditConcentrations}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.UNITS.endpoint}/:id/edit`}
            element={<PrivateRoute component={EditUnit} roles={[ADMIN_ROLE]} />}
          />
          <Route
            path={`${DataProviders.STORAGE_CONDITIONS.endpoint}/:id/edit`}
            element={
              <PrivateRoute
                component={EditStorageConditions}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.PURITIES_QUALITIES.endpoint}/:id/edit`}
            element={
              <PrivateRoute
                component={EditPurityQuality}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.PRECAUTIONARY_STATEMENT.endpoint}/:id/edit`}
            element={
              <PrivateRoute
                component={EditPrecautionaryStatement}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route
            path={`${DataProviders.PICTOGRAMS.endpoint}/:id/edit`}
            element={
              <PrivateRoute component={EditPictograms} roles={[ADMIN_ROLE]} />
            }
          />
          <Route
            path={`${DataProviders.CLP_CLASSIFICATIONS.endpoint}/:id/edit`}
            element={
              <PrivateRoute
                component={EditClpClassification}
                roles={[ADMIN_ROLE]}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
