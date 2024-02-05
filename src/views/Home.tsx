import { Grid } from "@mui/material";
import ExpirationDateNotifications from "./notifications/ExpirationDateNotifications.tsx";
import SafetyInstructionsList from "./reagents/common/SafetyInstructionsList.tsx";
import UsageRecordNotifications from "./notifications/UsageRecordNotifications.tsx";
import PersonalReagentRequestNotifications from "./notifications/PersonalReagentRequestNotifications.tsx";
import AwaitingForApprovalNotifications from "./notifications/ReagentsWaitingForApprovalNotifications";
import { ADMIN_ROLE, ANY_ROLE_LIST } from "../api/enums/userRoles";
import { PrivateComponent } from "../components/PrivateComponent";
import FewCriticalNotifications from "./notifications/FewCriticalNotifications";

function Home() {
  const minHeight = "700px";
  const workerNotifications = (
    <PrivateComponent
      roles={ANY_ROLE_LIST}
      component={() => (
        <>
          <PrivateComponent
            roles={[ADMIN_ROLE]}
            component={() => (
              <Grid item xs={12} sm={12}>
                <AwaitingForApprovalNotifications />
              </Grid>
            )}
          />
          <Grid item xs={12} sm={12} md={6} xl={4}>
            <UsageRecordNotifications style={{ height: minHeight }} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={4}>
            <ExpirationDateNotifications style={{ height: minHeight }} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={4}>
            <PersonalReagentRequestNotifications
              style={{ height: minHeight }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={12}>
            <FewCriticalNotifications style={{ height: minHeight }} />
          </Grid>
        </>
      )}
    />
  );

  return (
    <Grid container spacing={2}>
      {workerNotifications}
      <Grid item xs={12}>
        <SafetyInstructionsList />
      </Grid>
    </Grid>
  );
}

export default Home;
