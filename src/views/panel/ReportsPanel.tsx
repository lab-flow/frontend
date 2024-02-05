import { ReactElement, useMemo } from "react";
import { authenticationService } from "../../services/authenticationService.ts";
import BasePanel from "./BasePanel.tsx";
import { Names } from "../../api/common/dataNames";
import TextIcon from "../basic/TextIcon";
import ReportShow from "../reports/Show";
import {
  LabManagerReport,
  ProjectProcedureReport,
  SanepidPipReport,
} from "../reports/ReportViews";
import { ADMIN_ROLE, ROLE } from "../../api/enums/userRoles";

function ReportsPanel() {
  const { currentUserRoles } = authenticationService;
  const subNavBarItems = useMemo(() => {
    const itemList: Array<{
      name: string;
      id: string;
      icon?: ReactElement;
      component: ReactElement;
      visible: boolean;
      dividerBefore?: boolean;
    }> = [
      {
        name: Names.sanepid_pip_report,
        id: "sanepid-pip",
        component: <SanepidPipReport />,
        visible: currentUserRoles.some((r) =>
          [ADMIN_ROLE, ROLE.LAB_MANAGER].includes(r),
        ),
      },
      {
        name: Names.lab_manager_report,
        id: "lab-manager",
        component: <LabManagerReport />,
        visible: currentUserRoles.some((r) =>
          [ADMIN_ROLE, ROLE.LAB_MANAGER].includes(r),
        ),
      },
      {
        name: Names.project_procedure_report,
        id: "project-procedure",
        component: <ProjectProcedureReport />,
        visible: currentUserRoles.some((r) =>
          [ADMIN_ROLE, ROLE.PROCEDURE_MANAGER, ROLE.LAB_MANAGER].includes(r),
        ),
      },
      {
        name: "show",
        id: "show",
        component: <ReportShow />,
        visible: false,
      },
    ];

    let lp = 0;
    itemList.forEach((item, idx) => {
      lp = item.visible ? lp + 1 : lp;
      itemList[idx]["icon"] = <TextIcon text={lp.toString()} />;
    });
    return itemList;
  }, [currentUserRoles]);

  return <BasePanel subNavBarItems={subNavBarItems} baseUrl="/reports/" />;
}

export default ReportsPanel;
