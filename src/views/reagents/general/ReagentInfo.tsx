import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import ReagentGeneralInfo from "./ReagentGeneralInfo.tsx";
import { DataProviders } from "../../../api/dataProviders/DataProvider.ts";

function ReagentInfo() {
  const { id } = useParams();

  const {
    data: reagent,
    isFetching,
    isLoading,
  } = useQuery("getReagent", () => DataProviders.REAGENTS.getItem(Number(id)));

  return ReagentGeneralInfo(reagent?.data, isLoading || isFetching);
}

export default ReagentInfo;
