import { useMemo } from "react";
import BasePanel from "./BasePanel.tsx";
import { Names } from "../../api/common/dataNames";
import SafetyInstructionsList from "../reagents/common/SafetyInstructionsList";
import HazardStatements from "../hazard-statements/HazardStatements";
import TextIcon from "../basic/TextIcon";
import PrecautionaryStatement from "../precautionary-statement/PrecautionaryStatement";
import GHSWiki from "../hazard-statements/GHSWiki";
import AppInfo from "../app-info/AppInfo.tsx";
import UserManual from "../user-manual/UserManual";

function WikiPanel() {
  const subNavBarItems = useMemo(() => {
    return [
      {
        name: Names.safety_instruction,
        id: "safety-instructions",
        icon: <TextIcon text={"IB"} />,
        component: <SafetyInstructionsList />,
        visible: true,
      },
      {
        name: Names.hazard_statements,
        id: "hazard-statements",
        icon: <TextIcon text={"H"} />,
        component: <HazardStatements history={false} />,
        visible: true,
      },
      {
        name: Names.precautionary_statements,
        id: "precautionary-statements",
        icon: <TextIcon text={"P"} />,
        component: <PrecautionaryStatement history={false} />,
        visible: true,
      },
      {
        name: Names.ghs_hazard_statements,
        id: "hazard-statements-ghs",
        icon: <TextIcon text={"GHS"} />,
        component: <GHSWiki />,
        visible: true,
      },
      {
        name: Names.user_manual,
        id: "user-manual",
        dividerBefore: true,
        icon: <TextIcon text={"IO"} />,
        component: <UserManual />,
        visible: true,
      },
      {
        name: Names.app_info,
        id: "app-info",
        dividerBefore: true,
        icon: <TextIcon text={"I"} />,
        component: <AppInfo />,
        visible: true,
      },
    ];
  }, []);

  return <BasePanel subNavBarItems={subNavBarItems} baseUrl="/wiki/" />;
}

export default WikiPanel;
