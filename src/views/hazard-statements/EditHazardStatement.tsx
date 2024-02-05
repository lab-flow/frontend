import { useMutation, useQuery } from "react-query";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import HazardStatementForm from "./HazardStatementForm";
import { useNavigate, useParams } from "react-router-dom";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { unpackDataIdValuesFromDict } from "../../components/datagrid/DataUnpackUtils";
import { useContext } from "react";
import { APIAlertContext } from "../../providers/alertProvider";
import { HazardStatementsFormInterface } from "../../api/interfaces/hazardStatements.ts";
import FormPage from "../../components/basic/FormPage.tsx";

function EditHazardStatement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert } = useContext(APIAlertContext);

  const { mutate: createUnitMutate } = useMutation(
    DataProviders.HAZARD_STATEMENTS.updateAllItem,
    {
      onSuccess: () => {
        addAlert(Names.updated, "success");
        navigate(`/user-panel/${DataProviders.HAZARD_STATEMENTS.endpoint}`);
        remove();
      },
    },
  );

  const onSubmit = async (data: { id: number }) => {
    createUnitMutate(data);
  };

  const { data, isLoading, remove } = useQuery("hazardStatementInfo" + id, () =>
    DataProviders.HAZARD_STATEMENTS.getItem(Number(id)).then(
      (res) =>
        unpackDataIdValuesFromDict(
          res.data,
          false,
        ) as unknown as HazardStatementsFormInterface,
    ),
  );

  return FormPage({
    title: Names.hazard_statements + " - " + Names.edit,
    isLoading: isLoading,
    content: (
      <HazardStatementForm onSubmit={onSubmit} defaultValues={data} edit />
    ),
  });
}

export default EditHazardStatement;
