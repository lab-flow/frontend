import { useMemo } from "react";
import PeopleIcon from "@mui/icons-material/People";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

import Logs from "../history/Logs.tsx";
import UsersList from "../users/UsersList.tsx";
import BasePanel from "./BasePanel.tsx";
import { Names } from "../../api/common/dataNames";
import { ADMIN_ROLE, ROLE } from "../../api/enums/userRoles";
import { authenticationService } from "../../services/authenticationService";

function AdminPanel() {
  const { currentUserRoles } = authenticationService;
  const subNavBarItems = useMemo(
    () => [
      {
        name: Names.users,
        id: "users",
        icon: <PeopleIcon />,
        component: <UsersList history={false} />,
        visible: currentUserRoles.some((r) =>
          [ADMIN_ROLE, ROLE.LAB_MANAGER].includes(r),
        ),
      },
      {
        name: Names.logs,
        id: "logs",
        icon: <ManageSearchIcon />,
        component: <Logs />,
        visible: currentUserRoles.some((r) => [ADMIN_ROLE].includes(r)),
      },
    ],
    [currentUserRoles],
  );

  return <BasePanel subNavBarItems={subNavBarItems} baseUrl="/admin-panel/" />;
}

export default AdminPanel;
